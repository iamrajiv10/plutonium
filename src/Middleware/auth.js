const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const BookModel = require("../Model/bookModel");

//************************************AUTHENTICATION*********************** */


const authentication = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        const secretKey = "project-3-group-61";

        if (!token) {
            return res.status(401).send({ status: false, message: "Please provide token" });
        }

        const decoded = jwt.decode(token)
        if (!decoded) {
            return res.status(400).send({ status: false, message: "Invalid Authentication Token in request header" })
        }
        req["decoded"]=decoded
        if (Date.now() > decoded.exp * 1000) {
           return res.status(440).send({ status: false, message: "session expired, please login again" })
        }

        jwt.verify(token,secretKey,function (err,decoded)
        {
            if (err){
                return res.status(400).send({status: false, message: "Token Invalid"})
            } else {
                req.userId = decoded.userId;
                return next()
            }
            
        })

  

    } catch (error) {

        res.status(500).send({ error: error.message })
    }
}


//*********************************************AUTHORIZATION********************************* */

const authorization = async function (req, res, next) {
    try {

        const bookId = req.params.bookId;
        const decodedToken = req.userId;


        if (mongoose.Types.ObjectId.isValid(bookId) == false) {
            return res
                .status(400)
                .send({ status: false, message: "bookId is not valid" });
        }

        const bookByBookId = await BookModel.findOne({
            _id: bookId,
            isDeleted: false
        });

        if (!bookByBookId) {
            return res
                .status(404)
                .send({ status: false, message: `no book found by ${bookId}` });
        }

        if (decodedToken != bookByBookId.userId) {
            return res
                .status(403)
                .send({ status: false, message: `unauthorized access` });
        }

        next();

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

//**********************************EXPORTING BOTH MIDDLEWARE FUNCTIONS************************************* */

module.exports.authentication = authentication;
module.exports.authorization = authorization;