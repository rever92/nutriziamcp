#!/usr/bin/env node
/**
 * Setup script — authenticates with the Nutrizia backend and saves credentials.
 *
 * Usage:
 *   node bin/setup.js --email tu@email.com --password tuPassword [--base-url http://localhost:5000/api]
 */
import { createClient } from '../src/api-client.js';
import { writeCredentials } from '../src/auth.js';

const args = process.argv.slice(2);
function flag(name) {
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const email = flag('--email');
const password = flag('--password');
const baseUrl = flag('--base-url') || 'http://localhost:5000/api';

if (!email || !password) {
  console.error('Usage: node bin/setup.js --email <email> --password <password> [--base-url <url>]');
  process.exit(1);
}

try {
  const client = createClient({ baseUrl });
  const res = await client.post('auth/login', { email, password });
  writeCredentials({ token: res.token, role: res.role, email, baseUrl });
  console.log(`Login OK — email: ${email}, role: ${res.role}`);
  console.log(`Credentials saved. The MCP server will use them automatically.`);
} catch (e) {
  console.error(`Login failed: ${e.message}`);
  process.exit(1);
}
