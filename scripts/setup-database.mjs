import { neon } from '@neondatabase/serverless';

async function createPostsTable() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Creating posts table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        published BOOLEAN DEFAULT false,
        author VARCHAR(100) DEFAULT 'Duartec Team',
        category VARCHAR(100) DEFAULT 'Blog',
        tags JSONB DEFAULT '[]',
        read_time VARCHAR(20) DEFAULT '5 min',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    console.log('Posts table created successfully!');
    
    // Create indices
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)`;
    
    console.log('Indices created successfully!');
    
    // Test insert
    const testPost = await sql`
      INSERT INTO posts (title, content, slug, excerpt, published, tags)
      VALUES (
        'Test Database Connection',
        'This post confirms that the database connection and table creation is working properly.',
        'test-database-connection',
        'This post confirms that the database connection...',
        true,
        '["test", "database", "admin"]'
      )
      RETURNING id, title, created_at
    `;
    
    console.log('Test post created:', testPost[0]);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createPostsTable();