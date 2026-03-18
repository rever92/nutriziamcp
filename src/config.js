import { readCredentials } from './auth.js';

const DEFAULT_BASE_URL = 'http://localhost:5000/api';

export function resolveBaseUrl(flagUrl) {
  if (flagUrl) return flagUrl;
  if (process.env.NUTRIZIA_BASE_URL) return process.env.NUTRIZIA_BASE_URL;
  const creds = readCredentials();
  if (creds?.baseUrl) return creds.baseUrl;
  return DEFAULT_BASE_URL;
}
