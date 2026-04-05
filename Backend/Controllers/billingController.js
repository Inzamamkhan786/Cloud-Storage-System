const pool = require("../Models/db");


/*
GET USER USAGE SUMMARY
Calculates total requests and total data transferred
*/

exports.getUsageSummary = async (req, res) => {
  try {

    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT 
          operation,
          COUNT(*) AS total_requests,
          COALESCE(SUM(data_transferred_bytes),0) AS total_bytes
       FROM usage_logs
       WHERE user_id = $1
       GROUP BY operation`,
      [userId]
    );

    res.json({
      message: "Usage summary fetched successfully",
      usage: result.rows
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};



/*
CALCULATE BILLING COST
Example pricing model:
Upload  = ₹0.01 per MB
Download = ₹0.02 per MB
API Request = ₹0.001 per request
*/

exports.getBillingDetails = async (req, res) => {
  try {

    const userId = req.user.userId;

    const usage = await pool.query(
      `SELECT 
          operation,
          COUNT(*) AS request_count,
          COALESCE(SUM(data_transferred_bytes),0) AS total_bytes
       FROM usage_logs
       WHERE user_id = $1
       GROUP BY operation`,
      [userId]
    );

    let totalCost = 0;
    let billing = [];

    

   usage.rows.forEach((row) => {

  const bytes = Number(row.total_bytes);
  const requests = Number(row.request_count);

  const mb = bytes / (1024 * 1024);

  let cost = 0;

  if (row.operation === "UPLOAD") {
    cost = mb * 0.01;
  } 
  else if (row.operation === "DOWNLOAD") {
    cost = mb * 0.02;
  } 
  else if (row.operation === "LIST" || row.operation === "DELETE") {
    cost = requests * 0.001;
  }

  billing.push({
    operation: row.operation,
    requests,
    total_MB: mb.toFixed(2),
    cost: cost.toFixed(4)
  });

  totalCost += cost;

});

    res.json({
      billing,
      total_cost: totalCost.toFixed(4)
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};





exports.getUsage = async (req, res) => {
  try {

    const userId = req.user.userId;

    // total storage
    const storage = await pool.query(
      `SELECT COALESCE(SUM(size_bytes),0) AS total_storage
       FROM objects
       WHERE user_id=$1 AND is_deleted=false`,
      [userId]
    );

    // total files
    const files = await pool.query(
      `SELECT COUNT(*) AS total_files
       FROM objects
       WHERE user_id=$1 AND is_deleted=false`,
      [userId]
    );

    // get file types
    const fileTypes = await pool.query(
      `SELECT file_name, size_bytes
       FROM objects
       WHERE user_id=$1 AND is_deleted=false`,
      [userId]
    );

    let images = 0;
    let videos = 0;
    let docs = 0;
    let others = 0;

    fileTypes.rows.forEach(file => {

      const name = file.file_name.toLowerCase();

      if (name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        images += Number(file.size_bytes);
      }
      else if (name.match(/\.(mp4|mov|avi|mkv)$/)) {
        videos += Number(file.size_bytes);
      }
      else if (name.match(/\.(pdf|doc|docx|txt|ppt|pptx|xls|xlsx)$/)) {
        docs += Number(file.size_bytes);
      }
      else {
        others += Number(file.size_bytes);
      }

    });

    //const total = images + videos + docs + others || 1;

    // const fileStats = [
    //   { name: "Images", value: Number(row.images) },
    //   { name: "Videos", value: Number(row.videos) },
    //   { name: "Docs", value: Number(row.docs) },
    //   { name: "Others", value: Number(row.others) }
    // ];

    const storageBytes = Number(storage.rows[0].total_storage);

    const storageMB = storageBytes / (1024 * 1024);

    res.json({
      storageUsed: Number(storageMB.toFixed(2)),
      files: Number(files.rows[0].total_files),
      plan: "Basic",
      //fileStats
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};





exports.getUseNum = async (req, res) => {
  try {

    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE file_name ~* '\\.(jpg|jpeg|png|gif|webp)$') AS images,
        COUNT(*) FILTER (WHERE file_name ~* '\\.(mp4|mov|avi|mkv)$') AS videos,
        COUNT(*) FILTER (WHERE file_name ~* '\\.(pdf|doc|docx|txt|ppt|pptx|xls|xlsx)$') AS docs,
        COUNT(*) FILTER (
          WHERE file_name !~* '\\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|mkv|pdf|doc|docx|txt|ppt|pptx|xls|xlsx)$'
        ) AS others
      FROM objects
      WHERE user_id=$1 AND is_deleted=false`,
      [userId]
    );

    const row = result.rows[0];

    const fileStats = [
      { name: "Images", value: Number(row.images) },
      { name: "Videos", value: Number(row.videos) },
      { name: "Docs", value: Number(row.docs) },
      { name: "Others", value: Number(row.others) }
    ];

    res.json({
      fileStats
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};





