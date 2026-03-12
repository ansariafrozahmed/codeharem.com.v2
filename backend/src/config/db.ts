import { Pool } from "pg";
import { env } from "./env";

let pool: Pool;

if (env.NODE_ENV === "production") {
  // Render PostgreSQL
  pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // Local PostgreSQL
  pool = new Pool({
    user: env.DBUSER,
    host: env.DBHOST,
    database: env.DBNAME,
    password: env.DBPASSWORD,
    port: env.DBPORT,
  });
}

pool.query("SELECT 1", (err: any) => {
  if (err) {
    console.error("PostgreSQL connection error:", err);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

export default pool;
