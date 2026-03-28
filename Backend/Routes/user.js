const express = require("express");
const router = express.Router();
const pool = require("../Models/db");
const auth = require("../Middleware/authMiddleware");

router.get("/profile", auth, async (req, res) => {

try {

console.log("Decoded user:", req.user);

const user = await pool.query(
"SELECT name, email, storage_quota_bytes FROM users WHERE id=$1",
[req.user.userId]   // ← THIS IS THE FIX
);

console.log("DB result:", user.rows);

if(user.rows.length === 0){
return res.status(404).json({ error: "User not found" });
}

res.json({
name: user.rows[0].name,
email: user.rows[0].email,
plan: "Basic"
});

} catch(err){
console.log(err);
res.status(500).json({ error: "Server error" });
}

});

module.exports = router;