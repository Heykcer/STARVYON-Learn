/**
 * STARVYON Learn - Neon Database Setup & Schema Migration CLI
 * 
 * Run with: node scripts/setup-db.js
 * Or: npm run db:setup
 * 
 * Reads NEON_DATABASE_URL from .env or env.js and executes db/schema.sql
 * using Neon's native Serverless HTTP SQL API.
 */

const fs = require('fs');
const path = require('path');

// 1. Resolve environment variables
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
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        envConfig[key] = val;
      }
    });
  }

  // Fallback to env.js
  const envJsPath = path.resolve(__dirname, '../env.js');
  if (fs.existsSync(envJsPath)) {
    try {
      const jsEnv = require(envJsPath);
      if (jsEnv && jsEnv.config) {
        Object.assign(envConfig, jsEnv.config);
      }
    } catch (e) {
      // Ignore
    }
  }

  // Merge process.env overrides
  return Object.assign({}, envConfig, process.env);
}

// 2. Parse Postgres URI
function parseDbUrl(url) {
  try {
    const match = url.match(/postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
    if (match) {
      return {
        user: match[1],
        password: match[2],
        host: match[3],
        dbname: match[4]
      };
    }
  } catch (e) {
    // handled below
  }
  return null;
}

async function main() {
  console.log('====================================================');
  console.log(' STARVYON Learn — Neon PostgreSQL Database Setup');
  console.log('====================================================\n');

  const env = loadEnv();
  const dbUrl = env.NEON_DATABASE_URL || env.DATABASE_URL;

  if (!dbUrl || dbUrl.trim() === '' || dbUrl.includes('your-neon-endpoint') || dbUrl.includes('[endpoint]')) {
    console.error('❌ [Error] No valid Neon Database URL found.');
    console.error('Please configure NEON_DATABASE_URL in your .env file or env.js:');
    console.error('Example:');
    console.error('  NEON_DATABASE_URL=postgresql://alex:AbCdEf123@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require\n');
    process.exit(1);
  }

  const parsed = parseDbUrl(dbUrl);
  if (!parsed) {
    console.error('❌ [Error] Could not parse NEON_DATABASE_URL format.');
    process.exit(1);
  }

  console.log(`Connecting to Neon Host: ${parsed.host}`);
  console.log(`Database Name:          ${parsed.dbname}`);
  console.log(`User:                   ${parsed.user}\n`);

  // Read schema.sql
  const schemaPath = path.resolve(__dirname, '../db/schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ [Error] Schema file not found at: ${schemaPath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(schemaPath, 'utf8');
  console.log(`Reading SQL schema (${sqlContent.length} bytes)...`);

  const endpoint = `https://${parsed.host}/sql`;

  try {
    console.log('Executing schema definition on Neon PostgreSQL...');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parsed.password}`,
        'Neon-Connection-String': dbUrl
      },
      body: JSON.stringify({
        query: sqlContent
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Neon HTTP API responded with status ${response.status}: ${errText}`);
    }

    console.log('✅ Schema executed successfully!\n');

    // Verification check
    console.log('Verifying created tables...');
    const verifyRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parsed.password}`,
        'Neon-Connection-String': dbUrl
      },
      body: JSON.stringify({
        query: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name;
        `
      })
    });

    const verifyData = await verifyRes.json();
    console.log('Public tables confirmed in Neon Database:');
    if (verifyData && verifyData.rows) {
      verifyData.rows.forEach(r => console.log(`  - ${r.table_name}`));
    }

    console.log('\n🎉 [Success] Database setup is complete and ready for STARVYON Learn!\n');
  } catch (err) {
    console.error('\n❌ [Setup Failed]:', err.message);
    process.exit(1);
  }
}

main();
