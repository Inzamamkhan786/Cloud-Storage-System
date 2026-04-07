const { Pool } = require("pg");
require("dotenv").config();

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded" : "Missing");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// optional connect check
pool.connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully (Supabase)");
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err);
  });

module.exports = pool;
