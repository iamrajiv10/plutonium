const express = require('express');
const router = express.Router();
const bookController = require("../Controller/bookController");
const userController = require("../Controller/userController");
const reviewController = require("../Controller/reviewController");
const validation = require("../vallidation/validation")
const MiddleWare = require('../middleware/auth')

router.post("/register", validation.userValidation, userController.createUser)
router.post("/login", userController.login)
router.post('/books', MiddleWare.authentication ,bookController.createBook )
router.get("/books", MiddleWare.authentication, bookController.getBooks)
router.get("/books/:bookId",bookController.getBooksById)
router.put("/books/:bookId",MiddleWare.authentication,MiddleWare.authorization,bookController.updateBooks)
router.delete("/books/:bookId",MiddleWare.authentication, MiddleWare.authorization, bookController.deleteBookById)
router.post("/books/:bookId/review", reviewController.createReview)

module.exports = router;