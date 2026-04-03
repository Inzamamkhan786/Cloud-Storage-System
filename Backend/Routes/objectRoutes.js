const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const objectController = require("../Controllers/objectController");

router.get("/my-files", authMiddleware, objectController.getUserFiles);

module.exports = router;