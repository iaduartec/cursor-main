import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function testConnection() {
  try {
	const connectionString = process.env.POSTGRES_URL;
	if (!connectionString) throw new Error('POSTGRES_URL not found');
	const sql = neon(connectionString);
	const result = await sql`SELECT 1 as test`;
	console.log('✅ DB Connection successful: ', result);
  } catch (err) {
	console.error('❌ DB Connection failed: ', err.message);
  }
}

testConnection();
