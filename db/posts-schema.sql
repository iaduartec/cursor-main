-- Tabla para posts del blog
CREATE TABLE posts (
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
);

-- Índices para optimizar consultas
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);