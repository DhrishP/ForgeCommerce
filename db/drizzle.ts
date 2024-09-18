import { config } from "dotenv";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
config({ path: ".env" }); // or .env.local
const sql = neon(process.env.DATABASE_URL_NEON!);
export const db = drizzle(sql);