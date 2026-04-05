const cron = require("node-cron");
const pool = require("../Models/db");
const fs = require("fs");

cron.schedule("0 0 * * *", async () => {
  try {

    console.log("Running recycle bin cleanup...");

    const result = await pool.query(
      `SELECT id, file_path 
       FROM objects 
       WHERE is_deleted=true 
       AND deleted_at < NOW() - INTERVAL '10 days'`
    );

    for (const file of result.rows) {

      if (fs.existsSync(file.file_path)) {
        fs.unlinkSync(file.file_path);
      }

      await pool.query(
        `DELETE FROM objects WHERE id=$1`,
        [file.id]
      );
    }

    console.log("Recycle bin cleaned");

  } catch (error) {
    console.log("Cleanup error:", error);
  }
});