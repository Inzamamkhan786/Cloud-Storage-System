const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

//console.log("Auth routes loaded");
router.post("/signup", authController.signup);
router.post("/login", authController.login);


module.exports = router;