/**
 * STARVYON Learn - Production Validation & Integrity Test Suite
 * 
 * Run with: npm run validate
 * Or: npm test
 * 
 * Verifies syntax across all JavaScript files, schema completeness, KaTeX assets,
 * and environment fallbacks.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
let failures = 0;
let passes = 0;

function assert(condition, message) {
  if (condition) {
    passes++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failures++;
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

console.log('====================================================');
console.log(' STARVYON Learn — Pre-Flight Production Validation');
console.log('====================================================\n');

// 1. Validate Core JS Syntax
console.log('1. Validating JavaScript Files Syntax...');
const jsFiles = [
  'env.js',
  'js/app.js',
  'js/auth.js',
  'js/store.js',
  'js/db.js',
  'js/interactive.js',
  'js/viewer.js',
  'js/router.js',
  'js/data/catalog.js',
  'js/data/pathwaysData.js',
  'js/data/courses/aiFoundations.js',
  'js/data/courses/machineLearning.js',
  'js/data/courses/deepLearning.js',
  'js/data/courses/generativeAi.js',
  'js/data/courses/agenticAi.js',
  'scripts/setup-db.js',
  'scripts/test-db.js'
];

jsFiles.forEach(rel => {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    assert(false, `File exists: ${rel}`);
    return;
  }
  try {
    const code = fs.readFileSync(full, 'utf8');
    new vm.Script(code);
    assert(true, `Syntax: ${rel}`);
  } catch (err) {
    assert(false, `Syntax: ${rel} -> ${err.message}`);
  }
});

// 2. Validate KaTeX Assets
console.log('\n2. Validating KaTeX Mathematical Typesetting Assets...');
const katexFiles = [
  'vendor/katex/katex.min.js',
  'vendor/katex/auto-render.min.js',
  'vendor/katex/katex.min.css'
];

katexFiles.forEach(rel => {
  const full = path.join(root, rel);
  assert(fs.existsSync(full) && fs.statSync(full).size > 0, `KaTeX asset present: ${rel}`);
});

// 3. Validate Database Schema & SQL
console.log('\n3. Validating Database Schema & Scripts...');
const schemaFile = path.join(root, 'db/schema.sql');
assert(fs.existsSync(schemaFile), 'Schema file db/schema.sql exists');
if (fs.existsSync(schemaFile)) {
  const sql = fs.readFileSync(schemaFile, 'utf8');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS users'), 'Defines users table');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS user_activities'), 'Defines user_activities table');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS user_progress'), 'Defines user_progress table');
  assert(sql.includes('CREATE OR REPLACE VIEW user_activity_summaries'), 'Defines user_activity_summaries view');
}

// 4. Validate Environment Config
console.log('\n4. Validating Environment Configuration...');
const envExample = path.join(root, '.env.example');
assert(fs.existsSync(envExample), '.env.example exists');
const envJs = path.join(root, 'env.js');
assert(fs.existsSync(envJs), 'env.js exists');

if (fs.existsSync(envJs)) {
  try {
    const envModule = require(envJs);
    assert(typeof envModule.get === 'function', 'env.js exports get() helper');
    assert(typeof envModule.isDevelopment === 'function', 'env.js exports isDevelopment() helper');
    assert(typeof envModule.isFeatureEnabled === 'function', 'env.js exports isFeatureEnabled() helper');
  } catch (e) {
    assert(false, `env.js failed to load: ${e.message}`);
  }
}

// 5. Check Git Ignore Security
console.log('\n5. Verifying Secret Protection in .gitignore...');
const gitignore = path.join(root, '.gitignore');
assert(fs.existsSync(gitignore), '.gitignore exists');
if (fs.existsSync(gitignore)) {
  const content = fs.readFileSync(gitignore, 'utf8');
  assert(content.includes('.env'), '.gitignore excludes .env files');
  assert(content.includes('node_modules'), '.gitignore excludes node_modules');
}

console.log('\n====================================================');
console.log(` Summary: ${passes} Passed, ${failures} Failed`);
console.log('====================================================\n');

if (failures > 0) {
  process.exit(1);
} else {
  console.log('🚀 Pre-flight production checks passed! Project is ready for GitHub.\n');
}
