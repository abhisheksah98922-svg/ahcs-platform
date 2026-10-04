import { execSync } from 'child_process';

try {
  const res = execSync('npx prisma db push --accept-data-loss', { encoding: 'utf8' });
  console.log('SUCCESS:\n', res);
} catch (err) {
  console.log('STDERR:\n', err.stderr);
  console.log('STDOUT:\n', err.stdout);
}
