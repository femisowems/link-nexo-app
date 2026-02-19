
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";

// Fallback to a placeholder string to allow build to pass if env vars are missing
// The app will throw at runtime if it tries to connect with this.
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || "postgres://placeholder:placeholder@localhost:5432/placeholder";

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
