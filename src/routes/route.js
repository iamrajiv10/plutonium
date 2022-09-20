const express = require('express');
const router = express.Router();
const bookController = require("../Controller/bookController");
const userController = require("../Controller/userController");
const validation = require("../vallidation/validation")

router.post("/register", validation.userValidation, userController.createUser)
router.post("/login", userController.login)
//router.post("/books",bookController.creatbook)


module.exports = router;