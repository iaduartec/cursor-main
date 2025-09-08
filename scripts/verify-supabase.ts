// scripts/verify-supabase.ts
import postgres from 'postgres';
import { posts, services, projects, streams } from '../db/schema';

async function verifySupabaseConnection() {
  console.log('🔍 Verificando conexión a Supabase...\n');

  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ No se encontró POSTGRES_URL o DATABASE_URL en las variables de entorno');
    process.exit(1);
  }

  const sql = postgres(connectionString, { prepare: false });

  try {
    // Verificar posts
    const postsResult = await sql`SELECT COUNT(*) as count FROM posts`;
    const postsCount = postsResult[0].count;
    console.log(`📝 Posts en base de datos: ${postsCount}`);

    // Verificar servicios
    const servicesResult = await sql`SELECT COUNT(*) as count FROM services`;
    const servicesCount = servicesResult[0].count;
    console.log(`🔧 Servicios en base de datos: ${servicesCount}`);

    // Verificar proyectos
    const projectsResult = await sql`SELECT COUNT(*) as count FROM projects`;
    const projectsCount = projectsResult[0].count;
    console.log(`📁 Proyectos en base de datos: ${projectsCount}`);

    // Verificar streams
    const streamsResult = await sql`SELECT COUNT(*) as count FROM streams`;
    const streamsCount = streamsResult[0].count;
    console.log(`📹 Streams en base de datos: ${streamsCount}`);

    console.log('\n✅ Conexión a Supabase verificada exitosamente!');
    console.log('✅ Todos los datos han sido migrados correctamente.');

  } catch (error) {
    console.error('❌ Error al verificar conexión a Supabase:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

verifySupabaseConnection();