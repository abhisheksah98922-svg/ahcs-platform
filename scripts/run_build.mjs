import { execSync } from 'child_process';

console.log('Running Next.js production build...');
try {
  const buildOut = execSync('npm run build', {
    stdio: 'pipe',
    encoding: 'utf8',
    timeout: 300000,
  });
  console.log('✅ Build output:\n', buildOut);
} catch (err) {
  console.error('❌ Build failed:');
  if (err.stdout) console.log(err.stdout);
  if (err.stderr) console.error(err.stderr);
  process.exit(1);
}
