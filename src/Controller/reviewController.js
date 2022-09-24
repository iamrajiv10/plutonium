const mongoose = require('mongoose');
const BookModel = require('../Model/bookModel')
const reviewModel = require('../Model/reviewModel')
const moment = require("moment")
//const Validator = require('../vallidation/validation')

// const isValid = function (value) {
//     if (typeof (value) === undefined || typeof (value) === null) { return false }
//     if (typeof (value) === "string" && (value).trim().length > 0) { return true }
//     if (typeof (value) === "number" && (value).toString().length > 0) { return true }
// }

const isValidNumber = function(value)
{
    if (typeof (value) === undefined || typeof (value) === null) { return false }
    if (typeof (value) === "number" && (value).toString().length > 0) { return true }
}

const isValidReqBody = function (requestBody) {
    return Object.keys(requestBody).length < 0;
};

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};


const isValidString = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { return false }
    if (typeof (value) === "string" && (value).trim().length > 0) { return true }
};

//=====================================================Add Review to a Book======================================================


const createReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!bookId) { return res.status(400).send({ status: false, message: "please provide bookid" }) }

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Invalid bookId" }) }

        let checkBookId = await BookModel.findById(bookId);
        if (!checkBookId) { return res.status(400).send({ status: false, message: "No such bookId" }) }

        let data = req.body

        let { review, rating, reviewedBy, reviewedAt } = data

        if (!isValidReqBody(data)) { return res.status(400).send({ status: false, message: "please provide data in request body" }) }
        if(reviewedBy) {if (!isValidString(reviewedBy)) { return res.status(400).send({ status: false, message: "reviewedBy should be string." }) }}

        let guestId = "Guest"
        if (!isValidString(reviewedBy)) {
            data['reviewedBy'] = guestId
        }

        if (!reviewedAt) { return res.status(400).send({ status: false, message: "please provide reviewedAt is required" }) }

      
        //if (!rating) { return res.status(400).send({ status: false, message: "please provide rating" }) }
        if (!(rating >= 1 && rating <= 5) ) {
            return res.status(400).send({ status: false, message: "give rating 1 to 5 " })
        }
        if (!isValidNumber(rating)) { return res.status(400).send({ status: false, message: `rating should be number` }) }

        if (!isValidString(review)) { return res.status(400).send({ status: false, message: `review should be string` })}

        if (checkBookId.isDeleted == true) { return res.status(400).send({ status: false, message: "Already book deleted then you can not add" }) }

        let reviewData = await reviewModel.create({
            bookId: bookId,
            reviewedBy: reviewedBy ? reviewedBy : "Guest",
            reviewedAt: moment(reviewedAt).toISOString(),
            rating: rating,
            review: review
        })

        if (reviewData) { await BookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }) }

        let RD = await reviewModel.findOne({ _id: reviewData._id }).select({ _v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0 })

        res.status(201).send({ status: true, message: "review added", data: RD })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

///---------------------------------------------UPDATE Review---------------------------------------------///////
const updateReviews = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId
        let requestBody = req.body;
        const { review, rating, reviewedBy } = requestBody;

        if (!isValidReqBody(requestBody)) { return res.status(400).send({ status: false, message: "please provide data in request body" }) }

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: `bookId is missing.` }) }

        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: `reviewId is missing.` }) }

        if(review)
       {
           if (!isValidString(review)) { return res.status(400).send({ status: false, message: `review should be string` }) }
        }

        else if(reviewedBy && reviewedBy.trim().length == 0)
        {
            if (!isValidString(reviewedBy)) { return res.status(400).send({ status: false, message: "reviewedBy should be string." }) }
        }
          
       else
          { 
           
                if (!(rating >= 1 && rating <= 5) ) {
                return res.status(400).send({ status: false, message: ' please provide rating between 1 to 5' }) } 
                if (!isValidNumber(rating)) { return res.status(400).send({ status: false, message: `rating should be number` }) }
         }
        // if (!(rating >= 1 && rating <= 5) ) {
          //  return res.status(400).send({ status: false, message: ' please provide rating between 1 to 5' }) }
        
        let deletedBook = await BookModel.findOne({ _id: bookId, isDeleted: true })

        if (deletedBook) { return res.status(400).send({ status: false, msg: "Book has already been deleted." }) }

        let reviewById = await reviewModel.findOne({ _id: reviewId, isDeleted: true })

        if (reviewById) { return res.status(400).send({ status: false, msg: "Review has already been deleted." }) }

        let isReviewId = await reviewModel.findById({ _id: reviewId })

        if (bookId != isReviewId.bookId) { return res.status(400).send({ status: false, msg: "This review not belongs to this particular book." }) }
        
        const updatedTheReview = await reviewModel.findOneAndUpdate(
            // {_id:reviewId},{$set:{reviewedBy:reviewedBy,rating:rating,review:review},},{new:true})

            { _id: req.params.reviewId },
            {
                review: review,
                rating: rating,
                reviewedBy: reviewedBy,
                reviewedAt: moment().toISOString()

            },
            { new: true })

        return res.status(200).send({ status: true, message: "Successfully updated review details", data: updatedTheReview })
    }

    catch (err) {
        res.status(500).send({ status: false, Error: err.message, });
    }
}


//=====================================Delete Review =============================================

const delReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Invalid bookId" }) }

        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: "Invalid reviewId" }) }

        let checkBookId = await BookModel.findOne({_id: bookId, isDeleted: false});
        if (!checkBookId) {
            return res.status(400).send({ status: false, message: "No such book present" });
        }

        let checkReviewId = await reviewModel.findOne({_id: reviewId, isDeleted: false});
        if (!checkReviewId) {
            return res.status(400).send({ status: false, message: "No such review present" });
        }

        let deleteReview = await reviewModel.findByIdAndUpdate(
            reviewId,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (deleteReview) {
            await BookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })
        }
        res.status(200).send({ status: true, message: "SuccessFully Deleted" });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


module.exports.createReview = createReview;
module.exports.updateReviews = updateReviews;
module.exports.delReview = delReview;    