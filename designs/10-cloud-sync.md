# Step 10 — Cloud Sync (Cloudflare Workers + D1)

**Goal:** เพิ่ม login + sync save ข้ามเครื่อง โดยใช้ Cloudflare Workers (ฟรี tier) เป็น backend

**Estimated time:** 3–5 วัน (phase 2, ทำหลัง MVP ship)

> **หมายเหตุ:** Step นี้เป็น **future phase** ไม่อยู่ใน MVP v1. MVP ใช้ localStorage ล้วนๆ. เขียนไว้เป็น roadmap เพื่อให้ data model, SaveStore abstraction, และ schema เตรียมพร้อมมาตั้งแต่ step 03

---

## 10.1 Architecture

```
  ┌──────────────┐   HTTPS    ┌────────────────────┐
  │ Client (PWA) │ ─────────▶ │ Cloudflare Worker  │
  │              │   JWT      │   /api/*           │
  │ CompositeSS  │            │                    │
  │ local + cloud│            │  Auth, Sync, Push  │
  └──────┬───────┘            └────────┬───────────┘
         │                             │
         │                     ┌───────┴────────┐
         │                     │                │
         │             ┌───────▼─────┐  ┌───────▼────────┐
         │             │  D1 (SQL)   │  │ KV / R2        │
         │             │  users      │  │ save blobs     │
         │             │  subs       │  │ (gzipped JSON) │
         │             └─────────────┘  └────────────────┘
         │
         ▼ (offline-first local fallback)
    localStorage
```

- **Cloudflare Pages**: static frontend (step 08)
- **Cloudflare Workers**: API endpoints (`/api/*`)
- **D1**: SQL database สำหรับ users, push subscriptions
- **KV หรือ R2**: save blob storage (gzipped JSON, ขนาดเฉลี่ย 10–50 KB ต่อ user)

Workers ฟรี tier: 100k req/day — เพียงพอสำหรับ growth phase

## 10.2 Auth Strategy

**เลือก magic link ทาง email** (ไม่ต้องเก็บ password)
- Client กรอก email → POST `/api/auth/magic-link`
- Worker ส่ง email (ผ่าน MailChannels ฟรีบน Workers) พร้อม signed token
- Client click link → GET `/api/auth/verify?token=...` → Worker ออก JWT (HS256, 30 วัน)
- Client เก็บ JWT ใน localStorage

ถ้าอยาก UX ดีขึ้น → Google/Apple OAuth (ต้อง setup provider credentials, เพิ่มทีหลังได้)

## 10.3 Data Model (Cloudflare D1)

```sql
-- schema.sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- nanoid, matches local userId
  email TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE saves (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  blob_key TEXT NOT NULL,           -- KV key or R2 key
  updated_at INTEGER NOT NULL,
  size_bytes INTEGER NOT NULL
);

CREATE TABLE push_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  next_push_at INTEGER,             -- timestamp for cron to scan
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_subs_next_push ON push_subscriptions(next_push_at)
  WHERE next_push_at IS NOT NULL;
```

## 10.4 API Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/magic-link` | Send login email |
| GET  | `/api/auth/verify` | Exchange token → JWT |
| GET  | `/api/save` | Fetch user save (returns blob + updatedAt) |
| PUT  | `/api/save` | Upload save blob (with `If-Match: updatedAt`) |
| POST | `/api/push/subscribe` | Store push subscription |
| POST | `/api/push/schedule` | Set next_push_at (called on watering) |
| DELETE | `/api/push/subscribe` | Unsubscribe |

### Example: PUT /api/save
```ts
// worker/src/routes/save.ts
import { gunzipSync } from 'node:zlib';   // หรือใช้ DecompressionStream

export async function putSave(req: Request, env: Env, userId: string) {
  const clientUpdatedAt = Number(req.headers.get('If-Match') ?? 0);
  const body = await req.arrayBuffer();       // gzipped JSON

  const existing = await env.DB.prepare('SELECT updated_at FROM saves WHERE user_id = ?')
    .bind(userId).first<{ updated_at: number }>();

  if (existing && existing.updated_at > clientUpdatedAt) {
    return new Response('Conflict: server newer', { status: 409 });
  }

  const key = `save:${userId}`;
  await env.SAVES_KV.put(key, body);
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO saves (user_id, blob_key, updated_at, size_bytes)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET blob_key = ?, updated_at = ?, size_bytes = ?`
  ).bind(userId, key, now, body.byteLength, key, now, body.byteLength).run();

  return Response.json({ updatedAt: now });
}
```

## 10.5 Client: CompositeSaveStore

```ts
// src/store/cloudSaveStore.ts
import type { SaveStore, PlayerState } from './saveStore';
import pako from 'pako';

export class CompositeSaveStore implements SaveStore {
  constructor(
    private local: SaveStore,
    private getJwt: () => string | null,
  ) {}

  async load(): Promise<PlayerState | null> {
    // Local-first: return local immediately, sync cloud in background
    const local = await this.local.load();
    this.pullRemote().catch(console.error);   // fire-and-forget
    return local;
  }

  async save(state: PlayerState): Promise<void> {
    await this.local.save(state);
    this.pushRemote(state).catch(console.error);
  }

  async clear(): Promise<void> { await this.local.clear(); }

  private async pullRemote() {
    const jwt = this.getJwt();
    if (!jwt) return;
    const r = await fetch('/api/save', { headers: { Authorization: `Bearer ${jwt}` } });
    if (!r.ok) return;
    const { blob, updatedAt } = await r.json();
    const local = await this.local.load();
    if (local && local.updatedAt >= updatedAt) return;   // local newer
    const raw = pako.ungzip(Uint8Array.from(atob(blob), c => c.charCodeAt(0)), { to: 'string' });
    const remoteState = JSON.parse(raw) as PlayerState;
    await this.local.save(remoteState);
    // notify UI
    window.dispatchEvent(new CustomEvent('cloud-pull', { detail: remoteState }));
  }

  private async pushRemote(state: PlayerState) {
    const jwt = this.getJwt();
    if (!jwt) return;
    const json = JSON.stringify(state);
    const gzipped = pako.gzip(json);
    await fetch('/api/save', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/octet-stream',
        'If-Match': String(state.updatedAt),
      },
      body: gzipped,
    });
  }
}
```

## 10.6 Conflict Resolution

**Strategy: last-writer-wins (by `updatedAt`) + 409 conflict handling**

เมื่อ 409:
1. Pull remote
2. **Merge**: `collection` = union by `id`, `stats` = max, `streak` = pick higher `longestStreak`
3. Push merged state ใหม่

สำหรับ v2.1 ถ้ายังเจอปัญหา → ไปทาง operational log (append-only events: PLANT / WATER / HARVEST) + server replay

## 10.7 Web Push via Worker

### Subscribe flow
```ts
// client
const reg = await navigator.serviceWorker.ready;
const sub = await reg.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
});
await fetch('/api/push/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
  body: JSON.stringify(sub),
});
```

### Schedule on watering
```ts
// after successful water
await fetch('/api/push/schedule', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
  body: JSON.stringify({ nextPushAt: Date.now() + 30 * 60 * 1000 }),
});
```

### Cron trigger (wrangler.toml)
```toml
[triggers]
crons = ["* * * * *"]   # every minute
```

```ts
// worker/src/cron.ts
export async function scheduled(env: Env) {
  const now = Date.now();
  const rows = await env.DB.prepare(
    `SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE next_push_at <= ?`
  ).bind(now).all<{ id: string; endpoint: string; p256dh: string; auth: string }>();

  for (const sub of rows.results) {
    try {
      await sendWebPush(sub, {
        title: 'ต้นไม้พร้อมรดน้ำแล้ว 💧',
        body: 'แวะมาดูแลสวนของคุณ',
      }, env);
      await env.DB.prepare(`UPDATE push_subscriptions SET next_push_at = NULL WHERE id = ?`)
        .bind(sub.id).run();
    } catch (err) {
      if (isGone(err)) {
        await env.DB.prepare(`DELETE FROM push_subscriptions WHERE id = ?`).bind(sub.id).run();
      }
    }
  }
}
```

Worker จำเป็นต้องมี `web-push` impl ที่รองรับ Workers runtime (มี library `@block65/webcrypto-web-push` หรือเขียน signing + encryption ด้วย `crypto.subtle`)

## 10.8 Security Notes

- JWT: HS256 ด้วย secret ใน Worker env (ไม่ expose)
- Rate limit: ใช้ Cloudflare rate limiting rule บน `/api/*` (เช่น 60 req/min/IP)
- Save blob validate ที่ server: parse JSON → check `schemaVersion` valid → reject ถ้าผิด
- Size limit: reject blob > 200 KB (guard against abuse)
- CORS: restrict origin ให้เฉพาะ Pages domain
- Privacy: เก็บแค่ email + save blob, ไม่มี tracking

## 10.9 Migration Path: localStorage-only → Cloud

เมื่อ user login ครั้งแรก:
1. ถ้า client มี local save + server ไม่มี → push local → server (local wins)
2. ถ้า client มี local save + server มี save → show "import/merge?" dialog ให้ user เลือก
3. ถ้า client ไม่มี local + server มี → pull server → local

## 10.10 Cost Estimate

| Resource | Free tier | MVP usage | Room |
|---|---|---|---|
| Workers requests | 100k/day | ~10 req/user/day × 1k users = 10k | ✅ 10x |
| D1 rows read | 5M/day | ~5 reads/req × 10k = 50k | ✅ 100x |
| KV storage | 1 GB | 50KB × 10k = 500 MB | ✅ 2x |
| KV writes | 1k/day (free) | ~2 writes/user/day × 1k = 2k | ⚠️ อัปเกรด $5 plan |
| MailChannels | unlimited (via Workers) | Magic links | ✅ |

ถ้าเกิน free tier → Cloudflare Workers Paid $5/mo ครอบคลุมได้ถึง ~100k users

## ✅ Definition of Done (Phase 2)
- [ ] Cloudflare Worker deploy + D1 schema created
- [ ] Magic link login flow ใช้งานได้ end-to-end
- [ ] CompositeSaveStore pull/push ทำงาน, conflict 409 handle ได้
- [ ] Merge strategy ถูกต้อง (ปลูก 1 ต้นบนเครื่อง A + 1 ต้นบนเครื่อง B → sync แล้วได้ 2 ต้น)
- [ ] Web push subscription + cron delivery ทำงาน
- [ ] iOS PWA ได้ notification หลัง cooldown หมด
- [ ] Cost monitoring alert ถ้าใกล้ free tier limit

---

## 🎉 จบ Implementation Plan

กลับไปดู [`00-overview.md`](./00-overview.md) สำหรับ roadmap ภาพรวม

ถ้าพร้อม start coding → เริ่มจาก [`01-project-setup.md`](./01-project-setup.md)
