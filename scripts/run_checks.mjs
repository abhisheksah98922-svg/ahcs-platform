import { execSync } from 'child_process';

console.log('Running TypeScript check...');
try {
  const tscOut = execSync('npx tsc --noEmit', {
    stdio: 'pipe',
    encoding: 'utf8',
    timeout: 180000,
  });
  console.log('✅ TypeScript check passed cleanly (0 errors)!');
} catch (err) {
  console.error('❌ TypeScript check failed:');
  if (err.stdout) console.log(err.stdout);
  if (err.stderr) console.error(err.stderr);
  process.exit(1);
}
