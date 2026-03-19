const pool = require("../Models/db");

exports.getUserFiles = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT id,file_name,size_bytes,created_at
       FROM objects
       WHERE user_id=$1 AND is_deleted=false
       ORDER BY created_at DESC`,
      [userId]
    );

    // log LIST request – the operation_type enum must include 'LIST',
    // or this insert will throw.  We catch errors so listing still works.
    try {
        await pool.query(
    `INSERT INTO usage_logs
     (user_id, operation, object_id, data_transferred_bytes)
     VALUES ($1,$2,$3,$4)`,
    [userId, "LIST", null, 0]
   );
   
    } catch (logErr) {
      console.warn("usage_logs insert failed:", logErr.message);
    }

    res.json({
      files: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

