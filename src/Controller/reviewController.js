const mongoose = require('mongoose');
const BookModel = require('../Model/bookModel')
const reviewModel = require('../Model/reviewModel')
const moment = require("moment")

const isValid = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { return false }
    if (typeof (value) === "string" && (value).trim().length > 0) { return true }
    if (typeof (value) === "number" && (value).toString().length > 0) { return true }
}

const createReview = async function (req, res) {
    try {
      let bookId = req.params.bookId;
      if (!bookId) {
        return res
          .status(400)
          .send({ status: false, message: "please provide bookid" });
      }
      let checkBookId = await BookModel.findById(bookId);
      if (!checkBookId) {
        return res.status(400).send({ status: false, message: "No such bookId" });
      }
      let data = req.body;
      let { review, rating, reviewedBy, reviewedAt } = data;
      if (Object.keys(data).length == 0) {
        return res.status(400).send({
          status: false,
          message: "please provide data in request body",
        });
      }
      let guestId = "Guest"
      if (!isValid(reviewedBy)) {
           data['reviewedBy'] = guestId
           } 
      if (!reviewedAt) {
        return res.status(400).send({
          status: false,
          message: "please provide reviewedAt is required",
        });
      }
      if (!rating) {
        return res
          .status(400)
          .send({ status: false, message: "please provide rating" });
      }
      if (rating > 6 || rating < 0) {
        return res
          .status(400)
          .send({ status: false, message: "give rating 1 t0 5 " });
      }
  
  
      if(checkBookId.isDeleted==true){
        return res.status(400).send({status:false,message:"Already book deleted then you can not add"})
      }
      
      let reviewData=await reviewModel.create ({
        bookId: bookId,
        reviewedBy: reviewedBy ? reviewedBy : "Guest",
        reviewedAt: moment(reviewedAt).toISOString(),
        rating: rating,
        review: review

    })
      if(reviewData){
        await BookModel.findOneAndUpdate({_id:bookId},{$inc:{reviews:1}})
      }
      let RD=await reviewModel.findOne({_id:reviewData._id}).select({_v:0,createdAt:0,updatedAt:0,isDeleted:0})
      res.status(201).send({status:true,message:"review added",data:RD})
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  module.exports.createReview = createReview;      