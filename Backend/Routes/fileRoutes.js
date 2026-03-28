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

router.delete("/delete-duplicates", authMiddleware, fileController.deleteDuplicates);

router.delete("/:id", authMiddleware, fileController.deleteFile);

router.get("/duplicates", authMiddleware, fileController.getDuplicates);

module.exports = router;
