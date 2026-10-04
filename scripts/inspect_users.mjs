import fs from 'fs';

const raw = fs.readFileSync('data/ahcs_production.json', 'utf8');
const data = JSON.parse(raw);

console.log('--- USERS ---');
data.users.forEach(u => console.log(u.id, u.role, u.mobileNumber, u.email));

console.log('--- PROVIDERS ---');
data.providers.forEach(p => console.log(p.id, p.name, p.status, p.category));
