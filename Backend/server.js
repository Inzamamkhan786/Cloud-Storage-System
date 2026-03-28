require("dotenv").config();
const cors = require("cors");

const express = require("express");
const pool = require("./Models/db");
const authRoutes = require("./Routes/authRoutes");
const objectRoutes = require("./Routes/objectRoutes");
const fileRoutes = require("./Routes/fileRoutes");
const billingRoutes = require("./Routes/billingRoutes");
const user_detail = require("./Routes/user");

const app = express();
app.use(cors());
app.use(express.json());


app.use((req,res,next)=>{
  console.log(req.method, req.url);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/files", objectRoutes);   // list files
app.use("/api/files", fileRoutes);     // upload/download/delete
app.use("/api/billing", billingRoutes);
app.use("/api/user/",user_detail);

app.get("/", async (req, res) => {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
