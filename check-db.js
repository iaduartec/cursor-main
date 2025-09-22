import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function checkData() {
    try {
        const sql = neon(process.env.POSTGRES_URL);

        const services = await sql`SELECT COUNT(*) as count FROM services`;
        const projects = await sql`SELECT COUNT(*) as count FROM projects`;
        const posts = await sql`SELECT COUNT(*) as count FROM posts`;
        const streams = await sql`SELECT COUNT(*) as count FROM streams`;

        console.log('📊 Datos en base de datos:');
        console.log('Servicios:', services[0].count);
        console.log('Proyectos:', projects[0].count);
        console.log('Posts:', posts[0].count);
        console.log('Streams:', streams[0].count);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkData();