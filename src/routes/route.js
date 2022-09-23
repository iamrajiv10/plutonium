const express = require('express');
const router = express.Router();
const bookController = require("../Controller/bookController");
const userController = require("../Controller/userController");
const reviewController = require("../Controller/reviewController");
const validation = require("../vallidation/validation")
const {authentication,authorization} = require('../middleware/auth')

router.post("/register", validation.userValidation, userController.createUser)
router.post("/login", userController.login)
router.post('/books', authentication ,bookController.createBook )
router.get("/books", authentication, bookController.getBooks)
router.get("/books/:bookId", authentication, bookController.getBooksById)
router.put("/books/:bookId",authentication,authorization,bookController.updateBooks)
router.delete("/books/:bookId",authentication, authorization, bookController.deleteBookById)
router.post("/books/:bookId/review", reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReviews)
router.delete("/books/:bookId/review/:reviewId", reviewController.delReview)

//API for wrong route-Of-API
router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "The api you request is not available"
    })
})

module.exports = router;