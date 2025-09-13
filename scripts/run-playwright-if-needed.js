// Run Playwright tests only if SKIP_PLAYWRIGHT != '1'
const { execSync } = require('child_process');
const skip = process.env.SKIP_PLAYWRIGHT === '1';
if (skip) {
  console.log('SKIP_PLAYWRIGHT=1 set; skipping Playwright tests.');
  process.exit(0);
}
try {
  execSync('npx playwright test', { stdio: 'inherit' });
} catch (err) {
  process.exit(err.status || 1);
}
