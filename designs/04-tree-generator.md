# Step 04 — Tree Generator (Seeded L-System)

**Goal:** ได้ engine ที่รับ `(speciesId, seed)` แล้วคืน `THREE.BufferGeometry` (trunk + leaves) ที่ deterministic 100% — seed เดียวกันได้ต้นเดียวกันทุกครั้ง

**Estimated time:** 1–2 วัน (ส่วนที่ใช้เวลาที่สุดในโปรเจกต์)

---

## 4.1 Module Layout

```
src/engine/
├── rng.ts           # mulberry32 + helpers
├── lsystem.ts       # string rewriting
├── turtle.ts        # interpret string → 3D segments
├── treeBuilder.ts   # orchestrator (species + seed → geometry)
└── speciesGen.ts    # (tool) generate 300 species table
```

## 4.2 RNG (`src/engine/rng.ts`)

```ts
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Helpers
export const randRange = (rng: Rng, min: number, max: number) => min + rng() * (max - min);
export const randInt   = (rng: Rng, min: number, max: number) => Math.floor(randRange(rng, min, max + 1));
export const randPick  = <T>(rng: Rng, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)]!;
export const randSeed  = (): number => (Math.random() * 0xFFFFFFFF) >>> 0;
```

## 4.3 L-System (`src/engine/lsystem.ts`)

```ts
export interface LSystemInput {
  axiom: string;
  rules: Record<string, string>;
  iterations: number;
}

export function expandLSystem({ axiom, rules, iterations }: LSystemInput): string {
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = '';
    for (const ch of current) next += rules[ch] ?? ch;
    current = next;
    if (current.length > 50_000) break;   // safety valve
  }
  return current;
}
```

### ตัวอย่าง rules (classic fractal tree)
```ts
// Simple binary tree
{ axiom: 'F', rules: { F: 'FF+[+F-F-F]-[-F+F+F]' }, iterations: 4, ... }

// Bushy
{ axiom: 'X', rules: { X: 'F[+X][-X]FX', F: 'FF' }, iterations: 5, ... }

// Asymmetric
{ axiom: 'F', rules: { F: 'F[+F]F[-F][F]' }, iterations: 4, ... }
```

## 4.4 Turtle Interpreter (`src/engine/turtle.ts`)

แปลง L-system string → list ของ trunk segments + leaf positions
ใช้ 3D turtle (stack-based) รองรับ `[`, `]`, และ rotation บน yaw + pitch

```ts
import * as THREE from 'three';
import type { Rng } from './rng';

export interface TurtleParams {
  angle: number;         // deg
  length: number;
  thickness: number;
  lengthDecay: number;   // per level, e.g. 0.8
  thicknessDecay: number;
}

export interface TurtleOutput {
  segments: Array<{
    start: THREE.Vector3;
    end: THREE.Vector3;
    radiusStart: number;
    radiusEnd: number;
    depth: number;        // bracket nesting depth — used for trunk growth order
  }>;
  leafPositions: THREE.Vector3[];
  leafNormals: THREE.Vector3[];
  leafDepths: number[];   // depth ของ bracket stack ตอนที่ leaf ถูก emit
                          // ยิ่งลึก = อยู่ปลายกิ่ง = โผล่ทีหลัง
  bounds: THREE.Box3;
}

export function interpret(
  str: string,
  params: TurtleParams,
  rng: Rng,
): TurtleOutput {
  const angleRad = (params.angle * Math.PI) / 180;
  const jitter = 0.15;   // randomize each turn a bit for organic feel

  const segments: TurtleOutput['segments'] = [];
  const leafPositions: THREE.Vector3[] = [];
  const leafNormals: THREE.Vector3[] = [];
  const leafDepths: number[] = [];
  const bounds = new THREE.Box3();

  // Turtle state
  interface State {
    pos: THREE.Vector3;
    dir: THREE.Vector3;   // heading
    up: THREE.Vector3;
    len: number;
    thick: number;
  }
  const stack: State[] = [];
  let state: State = {
    pos: new THREE.Vector3(0, 0, 0),
    dir: new THREE.Vector3(0, 1, 0),
    up:  new THREE.Vector3(0, 0, 1),
    len: params.length,
    thick: params.thickness,
  };

  const rotate = (axis: THREE.Vector3, rad: number) => {
    const q = new THREE.Quaternion().setFromAxisAngle(axis, rad);
    state.dir.applyQuaternion(q).normalize();
    state.up.applyQuaternion(q).normalize();
  };

  for (const ch of str) {
    switch (ch) {
      case 'F': {
        const start = state.pos.clone();
        const end = start.clone().addScaledVector(state.dir, state.len);
        const rEnd = state.thick * params.thicknessDecay;
        segments.push({
          start, end,
          radiusStart: state.thick,
          radiusEnd: rEnd,
          depth: stack.length,      // 0 = trunk, deeper = branches
        });
        state.pos = end;
        state.len *= params.lengthDecay;
        state.thick = rEnd;
        bounds.expandByPoint(end);
        break;
      }
      case '+': rotate(state.up, angleRad * (1 + (rng() - 0.5) * jitter)); break;
      case '-': rotate(state.up, -angleRad * (1 + (rng() - 0.5) * jitter)); break;
      case '&': rotate(state.dir.clone().cross(state.up),  angleRad); break;
      case '^': rotate(state.dir.clone().cross(state.up), -angleRad); break;
      case '/': rotate(state.dir, angleRad); break;
      case '\\': rotate(state.dir, -angleRad); break;
      case '[':
        stack.push({
          pos: state.pos.clone(),
          dir: state.dir.clone(),
          up:  state.up.clone(),
          len: state.len,
          thick: state.thick,
        });
        break;
      case ']': {
        // Leaf at branch tip
        leafPositions.push(state.pos.clone());
        leafNormals.push(state.dir.clone());
        leafDepths.push(stack.length);   // depth ตอน emit
        const s = stack.pop();
        if (s) state = s;
        break;
      }
    }
  }
  return { segments, leafPositions, leafNormals, leafDepths, bounds };
}
```

## 4.5 Tree Builder (`src/engine/treeBuilder.ts`)

รวบทุกอย่างเป็น `BufferGeometry` 2 อัน: trunk (merged cylinders) + leaves (InstancedMesh data)

```ts
import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32, randRange, type Rng } from './rng';
import { expandLSystem } from './lsystem';
import { interpret } from './turtle';
import { SPECIES, type SpeciesDef } from '@/data/species';

export interface BuiltTree {
  trunk: THREE.BufferGeometry;
  leafPositions: Float32Array;        // x,y,z * N
  leafScales: Float32Array;           // N
  leafBirthThresholds: Float32Array;  // N, 0..1 — reveal order ตอน growth
  leafColor: THREE.Color;
  trunkColor: THREE.Color;
  bounds: THREE.Box3;
}

export function buildTree(speciesId: number, seed: number): BuiltTree {
  const species = SPECIES[speciesId];
  if (!species) throw new Error(`Unknown species ${speciesId}`);
  const rng = mulberry32(seed);

  // Perturb params with seed
  const angle     = species.lSystem.angleBase + randRange(rng, -8, 8);
  const length    = species.lSystem.lengthBase * randRange(rng, 0.85, 1.15);
  const thickness = species.lSystem.thicknessBase * randRange(rng, 0.9, 1.1);
  const iterations = species.lSystem.iterations + (rng() > 0.7 ? 1 : 0);

  const str = expandLSystem({
    axiom: species.lSystem.axiom,
    rules: species.lSystem.rules,
    iterations,
  });

  const out = interpret(
    str,
    { angle, length, thickness, lengthDecay: 0.82, thicknessDecay: 0.72 },
    rng,
  );

  // Build trunk by merging tapered cylinders per segment
  const trunkGeos: THREE.BufferGeometry[] = [];
  for (const seg of out.segments) {
    const dir = seg.end.clone().sub(seg.start);
    const len = dir.length();
    if (len < 1e-4) continue;
    const geo = new THREE.CylinderGeometry(seg.radiusEnd, seg.radiusStart, len, 6, 1, false);
    // Orient + translate to (start→end) midpoint
    const mid = seg.start.clone().add(seg.end).multiplyScalar(0.5);
    const mat = new THREE.Matrix4();
    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    mat.compose(mid, q, new THREE.Vector3(1, 1, 1));
    geo.applyMatrix4(mat);
    trunkGeos.push(geo);
  }
  const trunk = BufferGeometryUtils.mergeGeometries(trunkGeos, false);
  trunkGeos.forEach(g => g.dispose());

  // Leaf instance data
  const n = out.leafPositions.length;
  const leafPositions = new Float32Array(n * 3);
  const leafScales    = new Float32Array(n);
  const leafBirthThresholds = new Float32Array(n);

  // Map leaf depth → birth threshold (0..0.95)
  // ใบที่อยู่ใกล้ trunk (depth ต่ำ) → threshold ต่ำ → โผล่ก่อน
  // ใบปลายกิ่ง (depth สูง) → threshold สูง → โผล่ตอนท้าย
  const maxDepth = Math.max(1, ...out.leafDepths);
  for (let i = 0; i < n; i++) {
    const p = out.leafPositions[i]!;
    leafPositions[i * 3    ] = p.x;
    leafPositions[i * 3 + 1] = p.y;
    leafPositions[i * 3 + 2] = p.z;
    leafScales[i] = randRange(rng, 0.7, 1.3);

    // Normalize depth 0..1, add small jitter เพื่อไม่ให้ reveal เป็น step ชัดๆ
    const normDepth = out.leafDepths[i]! / maxDepth;
    const jitter = (rng() - 0.5) * 0.1;
    leafBirthThresholds[i] = Math.max(0, Math.min(0.95, normDepth * 0.9 + jitter));
  }

  return {
    trunk,
    leafPositions,
    leafScales,
    leafBirthThresholds,
    leafColor:  new THREE.Color().setHSL(...hslPerturb(species.lSystem.leafColor, rng)),
    trunkColor: new THREE.Color().setHSL(...hslPerturb(species.lSystem.trunkColor, rng)),
    bounds: out.bounds,
  };
}

function hslPerturb(
  base: [number, number, number],
  rng: Rng,
): [number, number, number] {
  return [
    ((base[0] / 360) + randRange(rng, -0.02, 0.02) + 1) % 1,
    Math.max(0, Math.min(1, base[1] + randRange(rng, -0.05, 0.05))),
    Math.max(0, Math.min(1, base[2] + randRange(rng, -0.05, 0.05))),
  ];
}
```

## 4.6 LRU Cache

Geometry building อาจกินเวลา 20–100 ms ต่อต้น → cache ที่ key = `${speciesId}:${seed}`

```ts
// src/engine/treeCache.ts
import { buildTree, type BuiltTree } from './treeBuilder';

const MAX = 30;
const cache = new Map<string, BuiltTree>();

export function getTree(speciesId: number, seed: number): BuiltTree {
  const key = `${speciesId}:${seed}`;
  const hit = cache.get(key);
  if (hit) {
    cache.delete(key);
    cache.set(key, hit);    // LRU bump
    return hit;
  }
  const built = buildTree(speciesId, seed);
  cache.set(key, built);
  if (cache.size > MAX) {
    const oldest = cache.keys().next().value;
    if (oldest) {
      cache.get(oldest)?.trunk.dispose();
      cache.delete(oldest);
    }
  }
  return built;
}
```

## 4.7 300 Species Generation (`src/engine/speciesGen.ts`)

เพื่อไม่ต้องเขียน 300 species ด้วยมือ → ใช้ **template sets** × variants

```ts
// Pseudocode — สร้าง species table จาก seed 'species-v1'
const TEMPLATES: Partial<SpeciesDef['lSystem']>[] = [
  // 10 base L-system archetypes (binary, ternary, asymmetric, ...)
];

const LEAF_PALETTES = [
  [120, 0.5, 0.4],  // forest green
  [90,  0.6, 0.5],  // lime
  [30,  0.7, 0.5],  // autumn orange
  [350, 0.5, 0.6],  // cherry blossom pink
  // ...
];

export function generateSpeciesTable(): SpeciesDef[] {
  const rng = mulberry32(0xC0FFEE);
  const result: SpeciesDef[] = [];

  // 200 common: 10 templates × 5 palettes × 4 angle variants
  // 80 rare: more exotic palettes + glow
  // 20 legendary: unique per-species hand-tuned

  for (let id = 0; id < 300; id++) {
    const rarity: Rarity =
      id < 200 ? 'common' : id < 280 ? 'rare' : 'legendary';
    const template = randPick(rng, TEMPLATES);
    const palette  = randPick(rng, LEAF_PALETTES);
    result.push({
      id,
      name: `Species ${id}`,   // replace with curated names later
      rarity,
      lSystem: {
        axiom: template.axiom!,
        rules: template.rules!,
        iterations: randInt(rng, 3, 5),
        angleBase: randRange(rng, 18, 30),
        lengthBase: 0.6,
        thicknessBase: 0.08,
        leafColor: palette as [number, number, number],
        trunkColor: [25, 0.4, 0.3],
      },
    });
  }
  return result;
}
```

→ Run ครั้งเดียว save ผลลง `src/data/species.json` เป็น static data

## 4.8 Determinism Test (สำคัญ!)

```ts
// tests/unit/treeBuilder.test.ts
import { describe, it, expect } from 'vitest';
import { buildTree } from '@/engine/treeBuilder';

describe('buildTree', () => {
  it('is deterministic for same (species, seed)', () => {
    const a = buildTree(0, 12345);
    const b = buildTree(0, 12345);
    expect(a.leafPositions).toEqual(b.leafPositions);
    expect(a.leafColor.getHex()).toBe(b.leafColor.getHex());
  });
  it('differs for different seed', () => {
    const a = buildTree(0, 1);
    const b = buildTree(0, 2);
    expect(a.leafPositions).not.toEqual(b.leafPositions);
  });
});
```

## ✅ Definition of Done
- [ ] `mulberry32` test: seed เดียวกัน → sequence เดียวกัน
- [ ] `expandLSystem` ขยาย string ถูกต้องตาม rules
- [ ] `interpret` สร้าง segments + leaves ตาม string
- [ ] `buildTree(0, 12345)` คืน `BuiltTree` ที่มี trunk + leaves
- [ ] Same input → identical output (determinism test ผ่าน)
- [ ] Different seed → visibly different tree
- [ ] Species table 300 records generated
- [ ] LRU cache ทำงาน (hit count > 0 หลังเรียกซ้ำ)

ถัดไป → [`05-game-logic.md`](./05-game-logic.md)
