import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
// import * as schema from "./schema"; // si tienes esquema tipado

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql); // añade { schema } si lo usas
export { sql };
