const express = require("express");
const router = express.Router();
const multer = require("multer");

const rateLimiter = require("../Middleware/rateLimiter");
const authMiddleware = require("../Middleware/authMiddleware");
const fileController = require("../Controllers/fileController");

// memory storage for supabase upload
const upload = multer({
    storage: multer.memoryStorage()
});

router.post(
  "/upload",
  authMiddleware,
  rateLimiter,
  upload.single("file"),
  fileController.uploadFile
);

router.get("/download/:id", authMiddleware, fileController.downloadFile);

router.delete("/delete-duplicates", authMiddleware, fileController.deleteDuplicates);

router.delete("/:id", authMiddleware, fileController.deleteFile);

router.get("/duplicates", authMiddleware, fileController.getDuplicates);

router.get("/recycle-bin", authMiddleware, fileController.getRecycleBin);

router.post("/restore/:id", authMiddleware, fileController.restoreFile);

router.delete("/permanent-delete/:id", authMiddleware, fileController.permanentDelete);

module.exports = router;
