const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const rateLimiter = require("../Middleware/rateLimiter");
const authMiddleware = require("../Middleware/authMiddleware");
const fileController = require("../Controllers/fileController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const userId = req.user.userId;

        const userFolder = path.join(__dirname, "..", "Uploads", userId.toString());

        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        cb(null, userFolder);
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/upload", authMiddleware,rateLimiter, upload.single("file"), fileController.uploadFile);

router.get("/download/:id", authMiddleware, fileController.downloadFile);

router.delete("/delete-duplicates", authMiddleware, fileController.deleteDuplicates);

router.delete("/:id", authMiddleware, fileController.deleteFile);

router.get("/duplicates", authMiddleware, fileController.getDuplicates);

module.exports = router;