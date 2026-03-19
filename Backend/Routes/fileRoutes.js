const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../Middleware/authMiddleware");
const fileController = require("../Controllers/fileController");

const storage = multer.diskStorage({
    destination: "Uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/upload", authMiddleware, upload.single("file"), fileController.uploadFile);

router.get("/download/:id", authMiddleware, fileController.downloadFile);

router.delete("/:id", authMiddleware, fileController.deleteFile);

module.exports = router;