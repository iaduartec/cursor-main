const fs = require('fs');
const postgres = require('postgres');
function mask(u){try{ const s = u.split('@'); if(s.length>1){ const left = s[0]; const parts = left.split('//'); const creds = parts[1].split(':'); return `${parts[0]}//${creds[0]}:*****@${s[1]}`; } return u }catch(e){return u}}
const raw = fs.readFileSync('.env','utf8');
const env = Object.fromEntries(raw.split(/\r?\n/).map(l => l.split('=').filter(Boolean)).map(a => [a[0],a.slice(1).join('=').replace(/^"|"$/g,'')]));

const poolerHost = (() => {
  const u = env.cxz_POSTGRES_URL_NON_POOLING || env.cxz_POSTGRES_PRISMA_URL || env.cxz_POSTGRES_URL;
  if(!u) {return null;} try{ const url = new URL(u); return url.hostname }catch(e){ const m = u.match(/@([^:]+):/); return m?m[1]:null }
})();
const directHost = env.cxz_POSTGRES_HOST || null;
const password = env.cxz_POSTGRES_PASSWORD || '';
const database = env.cxz_POSTGRES_DATABASE || 'postgres';

const originalUser = (() => { const u = env.cxz_POSTGRES_URL_NON_POOLING || env.cxz_POSTGRES_PRISMA_URL || env.cxz_POSTGRES_URL; if(!u) {return null;} try{ const url = new URL(u); return url.username }catch(e){ const m = u.match(/postgres:\/\/([^:]+):/); return m?m[1]:null }} )();

const usernames = Array.from(new Set([originalUser,'postgres'].filter(Boolean)));
const hosts = Array.from(new Set([poolerHost,directHost].filter(Boolean)));
const ports = [5432,6543];

console.log('Trying combinations:');
for(const h of hosts) {console.log(' host',h);}
for(const u of usernames) {console.log(' user',u);}
console.log(' ports',ports.join(','));

(async() => {
  for(const host of hosts){
    for(const port of ports){
      for(const user of usernames){
        const url = `postgres://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
        console.log('\n->', mask(url));
        const sql = postgres(url,{ssl:{rejectUnauthorized:false},max:1});
        try{
          const r = await sql`SELECT 1 as ok`;
          console.log('  success', r[0]);
          await sql.end();
        }catch(e){
          console.log('  failed', e && e.message ? e.message : e);
          try{ await sql.end(); }catch{}
        }
      }
    }
  }
})();
