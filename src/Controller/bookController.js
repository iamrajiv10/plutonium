const bookModel = require("../Model/bookModel");
const userModel=require("../Model/userModel")
let mongoose = require("mongoose");
const createBook = async function (req, res) {

    try {
        const data = req.body
        
   
    
    let{title,ISBN ,category, userId,subcategory,releasedAt}=data
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Data is mandatory" })
    if(!mongoose.Types.ObjectId.isValid(userId))return res.status(400).send({status:false,message:"invalid userId"})
    const user = await userModel.findById({_id:userId});
    console.log(user)
    if(!user)return res.status(400).send({status:false,message:"user is not found in db"})

    if (!title) return res.status(400).send({ status: false, message: "Title is mandatory" })
    const TitleData =await bookModel.find({title:title})
    if(!TitleData) return res.status(400).send({status:false,message:"title already present in database"})

    if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is mandatory" })
     if(!(/^[\d*\-]{10}|[\d*\-]{13}$/).test(ISBN)){return res.status(400).send({status:false,message:"ISBN is not valid"})}

    if (!category) return res.status(400).send({ status: false, message: "category is mandatory" })
    if (!subcategory) return res.status(400).send({ status: false, message: "subcategory is mandatory" })
    if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt is mandatory" })
   
        const bookData = await bookModel.create(data)
        return res.status(201).send({ status: true, data: bookData })
    }

    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
module.exports.createBook=createBook