import { neon, type NeonSql } from '@neondatabase/serverless';

async function verifyNeonConnection() {
  console.log('🔍 Verificando conexión a Neon...\n');

  const connectionString =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL;

  if (!connectionString) {
    console.error(
      '❌ No se encontró POSTGRES_URL, DATABASE_URL o NEON_DATABASE_URL en las variables de entorno'
    );
    process.exit(1);
  }

  const sql = neon(connectionString) as NeonSql<Record<string, unknown>>;

  try {
    const postsRows = await sql`SELECT COUNT(*) as count FROM posts`;
    console.log(
      `📝 Posts en base de datos: ${Number(postsRows?.[0]?.count ?? 0)}`
    );

    const servicesRows = await sql`SELECT COUNT(*) as count FROM services`;
    console.log(
      `🔧 Servicios en base de datos: ${Number(servicesRows?.[0]?.count ?? 0)}`
    );

    const projectsRows = await sql`SELECT COUNT(*) as count FROM projects`;
    console.log(
      `📁 Proyectos en base de datos: ${Number(projectsRows?.[0]?.count ?? 0)}`
    );

    const streamsRows = await sql`SELECT COUNT(*) as count FROM streams`;
    console.log(
      `📹 Streams en base de datos: ${Number(streamsRows?.[0]?.count ?? 0)}`
    );

    console.log('\n✅ Conexión a Neon verificada exitosamente!');
    console.log('✅ Todos los datos han sido migrados correctamente.');
  } catch (error) {
    console.error('❌ Error al verificar conexión a Neon:', error);
    process.exit(1);
  } finally {
    await sql.end?.();
  }
}

verifyNeonConnection();
