/**
 * STARVYON Learn - Database Health & Connectivity Tester
 * 
 * Run with: node scripts/test-db.js
 */

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  const envConfig = {};
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        envConfig[trimmed.slice(0, idx).trim()] = val;
      }
    });
  }
  return envConfig;
}

async function main() {
  const env = loadEnv();
  const dbUrl = env.NEON_DATABASE_URL || env.DATABASE_URL;

  console.log('Testing STARVYON Database Configuration...\n');

  if (!dbUrl || dbUrl.trim() === '') {
    console.log('ℹ️  Status: No NEON_DATABASE_URL defined in .env.');
    console.log('   The application is currently operating in Local Mock Storage mode.');
    console.log('   Once you obtain your Neon PostgreSQL connection string, paste it into .env.');
    return;
  }

  const match = dbUrl.match(/postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
  if (!match) {
    console.error('❌ Status: NEON_DATABASE_URL format is invalid.');
    return;
  }

  const host = match[3];
  const password = match[2];

  try {
    const res = await fetch(`https://${host}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${password}`,
        'Neon-Connection-String': dbUrl
      },
      body: JSON.stringify({ query: 'SELECT NOW() as current_time, version() as pg_version;' })
    });

    if (!res.ok) {
      throw new Error(`Neon returned HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    console.log('✅ Connected successfully to Neon PostgreSQL!');
    if (data && data.rows && data.rows[0]) {
      console.log('   Current DB Time:', data.rows[0].current_time);
      console.log('   Postgres Version:', data.rows[0].pg_version.split(',')[0]);
    }
  } catch (e) {
    console.error('❌ Connection test failed:', e.message);
  }
}

main();
