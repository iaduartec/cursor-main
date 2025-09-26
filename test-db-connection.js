require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function testDB() {
  try {
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT COUNT(*) as count FROM posts`;
    console.log('Posts count:', result);
    
    const posts = await sql`SELECT id, title, slug FROM posts LIMIT 3`;
    console.log('Sample posts:', posts);
  } catch (error) {
    console.error('Database error:', error);
  }
}

testDB();