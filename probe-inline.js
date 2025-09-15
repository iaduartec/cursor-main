/* eslint-disable @typescript-eslint/no-require-imports, no-undef, no-console, no-empty, @typescript-eslint/no-unused-vars, no-redeclare */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const postgres = require('postgres');
function mask(u){try{ const s = u.split('@'); if(s.length>1){ const left = s[0]; const parts = left.split('//'); const creds = parts[1].split(':'); return `${parts[0]}//${creds[0]}:*****@${s[1]}`; } return u }catch(e){return u}}
const raw = fs.readFileSync('.env','utf8');
const env = Object.fromEntries(raw.split(/\r?\n/).map(l => l.split('=').filter(Boolean)).map(a => [a[0],a.slice(1).join('=').replace(/^"|"$/g,'')]));
const cand = [];
if(env.cxz_POSTGRES_URL_NON_POOLING) {cand.push(['cxz_POSTGRES_URL_NON_POOLING',env.cxz_POSTGRES_URL_NON_POOLING]);}
if(env.cxz_POSTGRES_PRISMA_URL) {cand.push(['cxz_POSTGRES_PRISMA_URL',env.cxz_POSTGRES_PRISMA_URL]);}
if(env.cxz_POSTGRES_URL) {cand.push(['cxz_POSTGRES_URL',env.cxz_POSTGRES_URL]);}
if(env.cxz_POSTGRES_HOST && env.cxz_POSTGRES_PASSWORD && env.cxz_POSTGRES_DATABASE) {cand.push(['built',`postgres://postgres:${env.cxz_POSTGRES_PASSWORD}@${env.cxz_POSTGRES_HOST}:5432/${env.cxz_POSTGRES_DATABASE}?sslmode=require`]);}
(async() => {
 for(const [name,url] of cand){
  console.log('->',name,mask(url));
  const sql = postgres(url,{ssl:{rejectUnauthorized:false},max:1});
  try{const r = await sql`SELECT 1 as ok`; console.log('  success',r[0]); await sql.end()}catch(e){console.log('  failed',e.message); try{await sql.end()}catch{}}
 }
})();
