/**
 * Google Drive App Data utilities — client-side only, no backend required.
 *
 * Uses Google Identity Services (GIS) for OAuth and the Drive v3 REST API
 * to read/write a single JSON save file in the hidden App Data folder.
 * The App Data folder is invisible to the user in their Drive UI and is
 * scoped exclusively to this app's client ID.
 */
import type { PlayerState } from '@florify/shared';
import { migrate } from '@/store/migrations';

// ── Constants ───────────────────────────────────────────────────────────
const SAVE_FILENAME = 'florify-save.json';
const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

// ── GIS types (loaded via <script> in layout) ───────────────────────────
interface TokenClient {
  requestAccessToken(overrides?: { prompt?: string }): void;
  callback: ((response: TokenResponse) => void) | null;
}

interface TokenResponse {
  access_token: string;
  error?: string;
  expires_in: number;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: (response: TokenResponse) => void;
          }): TokenClient;
          revoke(token: string, done?: () => void): void;
        };
      };
    };
  }
}

// ── Token state ─────────────────────────────────────────────────────────
let accessToken: string | null = null;
let tokenExpiresAt = 0;

function isTokenValid(): boolean {
  return !!accessToken && Date.now() < tokenExpiresAt;
}

// ── Public API ──────────────────────────────────────────────────────────

/**
 * Check whether the Google Identity Services library is loaded.
 */
export function isGisLoaded(): boolean {
  return !!window.google?.accounts?.oauth2;
}

/**
 * Initiate the Google OAuth sign-in flow. Resolves with an access token
 * or rejects if the user cancels / an error occurs.
 */
export function signIn(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isGisLoaded()) {
      reject(new Error('Google Identity Services not loaded'));
      return;
    }
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (response: TokenResponse) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        accessToken = response.access_token;
        tokenExpiresAt = Date.now() + response.expires_in * 1000 - 60_000; // 1 min buffer
        resolve(response.access_token);
      },
    });
    client.requestAccessToken();
  });
}

/**
 * Revoke the current token and clear local auth state.
 */
export function signOut(): void {
  if (accessToken && isGisLoaded()) {
    window.google!.accounts.oauth2.revoke(accessToken);
  }
  accessToken = null;
  tokenExpiresAt = 0;
}

/**
 * Silently refresh the access token (re-prompts consent if needed).
 */
export function refreshToken(clientId: string): Promise<string> {
  return signIn(clientId);
}

function getToken(): string {
  if (!accessToken || !isTokenValid()) {
    throw new Error('Not authenticated — call signIn() first');
  }
  return accessToken;
}

// ── Drive REST helpers ──────────────────────────────────────────────────

async function driveGet(url: string, token: string): Promise<Response> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Drive GET ${url} → ${res.status}: ${await res.text()}`);
  }
  return res;
}

/**
 * Find the save file's ID in App Data, or `null` if it doesn't exist.
 */
async function findSaveFileId(token: string): Promise<string | null> {
  const params = new URLSearchParams({
    spaces: 'appDataFolder',
    q: `name='${SAVE_FILENAME}'`,
    fields: 'files(id)',
    pageSize: '1',
  });
  const res = await driveGet(`${DRIVE_FILES_URL}?${params}`, token);
  const data = (await res.json()) as { files?: { id: string }[] };
  return data.files?.[0]?.id ?? null;
}

/**
 * Load the player state from Google Drive App Data.
 * Returns `null` if no save file exists.
 */
export async function loadFromDrive(): Promise<PlayerState | null> {
  const token = getToken();
  const fileId = await findSaveFileId(token);
  if (!fileId) return null;

  const res = await driveGet(
    `${DRIVE_FILES_URL}/${fileId}?alt=media`,
    token,
  );
  const raw = (await res.json()) as { schemaVersion: number } & Record<string, unknown>;
  return migrate(raw);
}

/**
 * Save the player state to Google Drive App Data.
 * Creates the file on first save; updates in-place afterwards.
 */
export async function saveToDrive(state: PlayerState): Promise<void> {
  const token = getToken();
  const body = JSON.stringify(state);
  const fileId = await findSaveFileId(token);

  if (fileId) {
    // Update existing file (PATCH multipart)
    const res = await fetch(`${DRIVE_UPLOAD_URL}/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    });
    if (!res.ok) {
      throw new Error(`Drive PATCH → ${res.status}: ${await res.text()}`);
    }
  } else {
    // Create new file in appDataFolder
    const metadata = {
      name: SAVE_FILENAME,
      parents: ['appDataFolder'],
    };
    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
    );
    form.append('file', new Blob([body], { type: 'application/json' }));

    const res = await fetch(`${DRIVE_UPLOAD_URL}?uploadType=multipart`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) {
      throw new Error(`Drive POST → ${res.status}: ${await res.text()}`);
    }
  }
}

export { SCOPES };
