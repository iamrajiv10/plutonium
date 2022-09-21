const BookModel = require('../Model/bookModel')
const reviewModel = require('../Model/reviewModel')
const UserModel = require('../Model/userModel')
const moment = require("moment");
const { default: mongoose } = require('mongoose');


//**************************VALIDATION FUNCTION*******************/

const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValidRequestBody = function (object) {
  return Object.keys(object).length > 0;
};

const isValidIdType = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
};

const isValidSubcategory = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length > 0) return true;
  if (typeof value == "object" && Array.isArray(value) == true) return true;
};


//************************************NEW BOOK REGISTRATION*************************/

const createBook = async function (req, res) {

  try {

    const requestBody = req.body;
    const queryParams = req.query;
    const decodedToken = req.decodedToken;

    //  query params should be empty
    if (isValidRequestBody(queryParams)) {
      return res
        .status(400)
        .send({ status: false, message: "invalid request" });
    }

    if (!isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "Book data is required to create a new user" });
    }

    // using destructuring then validate the keys

    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = requestBody;

    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: `title is required and should be in valid format` });
    }

    // title must be unique
    const isTitleUnique = await BookModel.findOne({
      title: title,
      isDeleted: false,
      deletedAt: null,
    });

    if (isTitleUnique) {
      return res
        .status(400)
        .send({ status: false, message: `title already exist` });
    }

    if (!isValid(excerpt)) {
      return res
        .status(400)
        .send({ status: false, message: `excerpt is required and should be in valid format` });
    }

    if (!isValid(userId)) {
      return res
        .status(400)
        .send({ status: false, message: `userId is required and should be in valid format` });
    }

    if (!isValidIdType(userId)) {
      return res
        .status(400)
        .send({ status: false, message: `enter a valid userId` });
    }

    // finding user with the given id
    const isUserExistWithID = await UserModel.findById(userId);

    if (!isUserExistWithID) {
      return res
        .status(404)
        .send({ status: false, message: `no user exist with ${userId}` });
    }

    // authorization
    if (decodedToken.userId != requestBody.userId) {
      return res
        .status(401)
        .send({ status: false, message: `unauthorized access` });

    }

    if (!isValid(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: `ISBN is required` });
    }

    // checking ISBN format
    if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
.test(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: `enter a valid ISBN of 13 digits` });
    }

    // ISBN should be unique
    const isUniqueISBN = await BookModel.findOne({
      ISBN: ISBN,
      isDeleted: false,
      deletedAt: null,
    });

    if (isUniqueISBN) {
      return res
        .status(400)
        .send({ status: false, message: `ISBN already exist` });
    }

    if (!isValid(category)) {
      return res
        .status(400)
        .send({ status: false, message: `category is required and should be in valid format` });
    }

    // if subcategory is an array then validating each element
    if (Array.isArray(subcategory)) {
      for (let i = 0; i < subcategory.length; i++) {
        element = subcategory[i];
        if (!isValid(element)) {
          return res
            .status(400)
            .send({ status: false, message: `subcategory is required and should be in valid format` });
        }
      }
    }

    // if subcategory is not an array then validating that
    if (!isValidSubcategory(subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: `subcategory is required and should be in valid format` });
    }

    if (!isValid(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, message: `releasedAt is required` });
    }

    // checking date format
    if (!/^[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}/.test(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, message: `released date format should be YYYY-MM-DD` });
    }

    // validating the date
    if (moment(releasedAt).isValid() == false) {
      return res
        .status(400)
        .send({ status: false, message: "enter a valid released date" });
    }

    // adding validated keys from requestBody and adding default values of isDeleted, reviews and deletedAt

    const bookData = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      userId: userId.trim(),
      ISBN: ISBN.trim(),
      category: category.trim(),
      subcategory: subcategory,
      releasedAt: releasedAt,
      isDeleted: false,
      reviews: 0,
      deletedAt: null,
    };

    const newBook = await BookModel.create(bookData);

    res
      .status(201)
      .send({ status: true, message: "new book added successfully", data: newBook });

  } catch (err) {

    res.status(500).send({ error: err.message });

  }
};
// ----------------------------------------------------- GET /books/:bookId ----------------------------------------------------


const getBooksById = async function (req, res) {

    try {

        let bookId = req.params.bookId
        if(!isValidIdType(bookId)) {return res.status(400).send({ status: false, message: "please give valid bookId" })}
        let findBook = await BookModel.findOne({_id: bookId, isDeleted: false}).lean()
        if (!findBook) {return res.status(404).send({ status: false, message: "No book found" })}
            
        const reviewData = await reviewModel.find({ bookId:findBook._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
         findBook["reviewsData"] = reviewData
      res.status(200).send({status:true, message:'Book list', data:findBook})

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });

    }
};

module.exports.createBook = createBook;
module.exports.getBooksById = getBooksById
