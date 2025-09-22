import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from '../db/schema.js';
import { postsPolicies, projectsPolicies, servicesPolicies, streamsPolicies } from '../db/schema.js';

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is required');
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function applyRLSPolicies() {
    console.log('Applying RLS policies...');

    try {
        // Enable RLS on tables
        await db.execute(sql`ALTER TABLE posts ENABLE ROW LEVEL SECURITY;`);
        await db.execute(sql`ALTER TABLE projects ENABLE ROW LEVEL SECURITY;`);
        await db.execute(sql`ALTER TABLE services ENABLE ROW LEVEL SECURITY;`);
        await db.execute(sql`ALTER TABLE streams ENABLE ROW LEVEL SECURITY;`);

        // Apply policies for posts
        for (const policy of postsPolicies) {
            await db.execute(sql`${policy}`);
        }

        // Apply policies for projects
        for (const policy of projectsPolicies) {
            await db.execute(sql`${policy}`);
        }

        // Apply policies for services
        for (const policy of servicesPolicies) {
            await db.execute(sql`${policy}`);
        }

        // Apply policies for streams
        for (const policy of streamsPolicies) {
            await db.execute(sql`${policy}`);
        }

        console.log('RLS policies applied successfully!');
    } catch (error) {
        console.error('Error applying RLS policies:', error);
    } finally {
        await client.end();
    }
}

applyRLSPolicies();