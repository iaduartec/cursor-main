/**
Resumen generado automáticamente.

scripts/verify-supabase.ts

2025-09-13T06:20:07.387Z

——————————————————————————————
Archivo .ts: verify-supabase.ts
Tamaño: 1724 caracteres, 48 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
// scripts/verify-supabase.ts
import postgres from 'postgres';

async function verifySupabaseConnection() {
  console.log('🔍 Verificando conexión a Neon/Postgres...\n');

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

  console.log('\n✅ Conexión a Neon/Postgres verificada exitosamente!');
  console.log('✅ Verificación de datos completada.');

  } catch (error) {
  console.error('❌ Error al verificar conexión a Neon/Postgres:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

verifySupabaseConnection();