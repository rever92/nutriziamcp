import { readFileSync, writeFileSync, mkdirSync, unlinkSync, existsSync, chmodSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CREDS_DIR = join(homedir(), '.nutrizia');
const CREDS_FILE = join(CREDS_DIR, 'credentials.json');

export function readCredentials() {
  try {
    return JSON.parse(readFileSync(CREDS_FILE, 'utf8'));
  } catch {
    return null;
  }
}

export function writeCredentials(data) {
  mkdirSync(CREDS_DIR, { recursive: true });
  writeFileSync(CREDS_FILE, JSON.stringify(data, null, 2), { mode: 0o600 });
  try { chmodSync(CREDS_FILE, 0o600); } catch {}
}

export function deleteCredentials() {
  try { unlinkSync(CREDS_FILE); } catch {}
}

export function getToken() {
  const creds = readCredentials();
  if (!creds?.token) return null;
  try {
    const payload = JSON.parse(Buffer.from(creds.token.split('.')[1], 'base64').toString());
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return creds.token;
  } catch {
    return creds.token;
  }
}

export function getTokenInfo() {
  const creds = readCredentials();
  if (!creds?.token) return null;
  try {
    const payload = JSON.parse(Buffer.from(creds.token.split('.')[1], 'base64').toString());
    const expiresAt = payload.exp ? new Date(payload.exp * 1000) : null;
    const daysLeft = expiresAt ? Math.max(0, Math.floor((expiresAt - Date.now()) / 86400000)) : null;
    return { email: creds.email, role: creds.role, expiresAt, daysLeft, expired: expiresAt ? expiresAt < new Date() : false };
  } catch {
    return { email: creds.email, role: creds.role };
  }
}
