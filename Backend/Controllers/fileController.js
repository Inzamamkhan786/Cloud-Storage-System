const pool = require("../Models/db");
const path = require("path");
const fs = require("fs");
const UPLOAD_DIR = path.join(process.cwd(), "Uploads");

const MAX_STORAGE_BYTES = 5 * 1024 * 1024 * 1024; // 5GB
exports.uploadFile = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.userId;

    const fileName = req.file.originalname;
    const filePath = req.file.path;
    const sizeBytes = req.file.size;

    // ===============================
    // CHECK CURRENT STORAGE USED
    // ===============================

    const storageResult = await pool.query(
      `SELECT COALESCE(SUM(size_bytes),0) AS total_storage
       FROM objects
       WHERE user_id=$1 AND is_deleted=false`,
      [userId]
    );

    const currentStorage = Number(storageResult.rows[0].total_storage);

    // ===============================
    // CHECK STORAGE LIMIT
    // ===============================

    if (currentStorage + sizeBytes > MAX_STORAGE_BYTES) {

  // remove uploaded file
  const fileLocation = path.join(__dirname, "..", "uploads", filePath);

  if (fs.existsSync(fileLocation)) {
    fs.unlinkSync(fileLocation);
  }

  return res.status(400).json({
    message: "Storage full (5GB limit). Upgrade your plan."
  });


}

    // ===============================
    // INSERT FILE
    // ===============================

    const result = await pool.query(
      `INSERT INTO objects (user_id, file_name, file_path, size_bytes)
       VALUES ($1,$2,$3,$4)
       RETURNING id,file_name,size_bytes`,
      [userId, fileName, filePath, sizeBytes]
    );

    const objectId = result.rows[0].id;

    // ===============================
    // LOG USAGE
    // ===============================

    await pool.query(
      `INSERT INTO usage_logs (user_id, object_id, operation, data_transferred_bytes)
       VALUES ($1,$2,$3,$4)`,
      [userId, objectId, "UPLOAD", sizeBytes]
    );

    res.status(201).json({
      message: "File uploaded successfully",
      file: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};




exports.downloadFile = async (req, res) => {
  try {

    const objectId = req.params.id;
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT file_name, file_path, size_bytes
       FROM objects
       WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
      [objectId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = result.rows[0];

    const fileFullPath = file.file_path;

    // log download usage
    await pool.query(
      `INSERT INTO usage_logs (user_id, object_id, operation, data_transferred_bytes)
       VALUES ($1,$2,$3,$4)`,
      [userId, objectId, "DOWNLOAD", file.size_bytes]
    );

    res.download(fileFullPath, file.file_name);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





exports.deleteFile = async (req, res) => {
  try {

    const objectId = req.params.id;
    const userId = req.user.userId;

    // check if file exists and belongs to the user
    const result = await pool.query(
      `SELECT file_path FROM objects
       WHERE id=$1 AND user_id=$2 AND is_deleted=false`,
      [objectId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    const file = result.rows[0];

    const fileLocation = file.file_path;

    // remove file from server storage
    if (fs.existsSync(fileLocation)) {
      fs.unlinkSync(fileLocation);
    }

    // mark file as deleted in database
    await pool.query(
      `UPDATE objects
       SET is_deleted = true
       WHERE id=$1`,
      [objectId]
    );

    // log delete usage
    await pool.query(
      `INSERT INTO usage_logs
       (user_id, object_id, operation, data_transferred_bytes)
       VALUES ($1,$2,$3,$4)`,
      [userId, objectId, "DELETE", 0]
    );

    res.json({
      message: "File deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};





exports.getDuplicates = async (req, res) => {
  try {

    const userId = req.user.userId;

    const duplicates = await pool.query(
      `SELECT file_name, COUNT(*) 
       FROM objects
       WHERE user_id=$1 AND is_deleted=false
       GROUP BY file_name
       HAVING COUNT(*) > 1`,
      [userId]
    );

    res.json({
      hasDuplicates: duplicates.rows.length > 0,
      duplicates: duplicates.rows
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};




exports.deleteDuplicates = async (req, res) => {
  try {

    console.log("DELETE DUPLICATES CALLED");

    const userId = req.user.userId;

    console.log("User ID:", userId);

    const duplicates = await pool.query(
      `SELECT file_name
       FROM objects
       WHERE user_id=$1 AND is_deleted=false
       GROUP BY file_name
       HAVING COUNT(*) > 1`,
      [userId]
    );

    console.log("Duplicates:", duplicates.rows);

    for (const row of duplicates.rows) {

      const files = await pool.query(
        `SELECT id, file_path
         FROM objects
         WHERE user_id=$1 
         AND file_name=$2
         AND is_deleted=false
         ORDER BY id`,
        [userId, row.file_name]
      );

      console.log("Files:", files.rows);

      const duplicateFiles = files.rows.slice(1);

      for (const file of duplicateFiles) {

        console.log("Deleting:", file);

        const fileLocation = path.join(
          __dirname,
          "..",
          "Uploads",
          file.file_path
        );

        console.log("Path:", fileLocation);

        if (fs.existsSync(fileLocation)) {
          fs.unlinkSync(fileLocation);
        }

        await pool.query(
          `UPDATE objects 
           SET is_deleted=true 
           WHERE id=$1`,
          [file.id]
        );

      }

    }

    res.json({
      message: "Duplicates deleted successfully"
    });

  } catch (error) {

    console.log("DELETE DUPLICATES ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};