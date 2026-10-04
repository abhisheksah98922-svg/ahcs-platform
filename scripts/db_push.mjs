import { execSync } from 'child_process';

console.log('Running prisma db push directly from script...');
try {
  const output = execSync('npx prisma db push --accept-data-loss', {
    stdio: 'pipe',
    env: process.env,
    encoding: 'utf8',
    timeout: 60000
  });
  console.log('Prisma db push output:\n', output);
} catch (err) {
  console.error('Error running prisma db push:');
  if (err.stdout) console.log('stdout:', err.stdout);
  if (err.stderr) console.error('stderr:', err.stderr);
}
