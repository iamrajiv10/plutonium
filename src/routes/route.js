const express = require('express');
const router = express.Router();
const bookController = require("../Controller/bookController");
const userController = require("../Controller/userController");
const validation = require("../vallidation/validation")
const MiddleWare = require('../middleware/auth')

router.post("/register", validation.userValidation, userController.createUser)
router.post("/login", userController.login)
router.post('/books', MiddleWare.authentication ,bookController.createBook )
router.get("/books/:bookId",bookController.getBooksById)


module.exports = router;