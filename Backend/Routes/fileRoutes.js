const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const rateLimiter = require("../Middleware/rateLimiter");
const authMiddleware = require("../Middleware/authMiddleware");
const fileController = require("../Controllers/fileController");

const storage = multer.memoryStorage({

    destination: function (req, file, cb) {

        const userId = req.user.userId;

        const baseFolder = path.join(__dirname, "..", "Uploads", userId.toString());

        const uploadFolder = path.join(baseFolder, "uploads");
        const recycleFolder = path.join(baseFolder, "recycleBin");

        [uploadFolder, recycleFolder].forEach(folder => {
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }
        });

        cb(null, uploadFolder);
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

router.get("/recycle-bin",authMiddleware,fileController.getRecycleBin);

router.post("/restore/:id",authMiddleware,fileController.restoreFile);

router.delete("/permanent-delete/:id",authMiddleware,fileController.permanentDelete);


module.exports = router;
