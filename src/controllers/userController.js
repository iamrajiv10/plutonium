const userModel = require("../models/userModel")
const UserModel= require("../models/userModel")


/*const createOrder = async function (req, res) {
    let header = req.headers["isfreeappuser"]
    
    if(!header){
        res.send({msg: "header is not present"})
    }
    //product and user validation

    let product = await productModel.findById(productId)
    if (!product){
        res.send({msg: "product doesn't exist"})
    }

    let user = await userModel.findById(userId)
    if (!user){
        res.send({msg: "userdoesn't exist"})
    }
    let headerValue = false 
    if(header === 'true'){
        headerValue = true
    }
    let oreder={
         isFreeAppUser: headerValue,
         productId:productId,
         userId: userId
    }
    if(headerValue) {
        oreder.amount = 0
        let orderCreated = await orderModel.create(order)
        res.send({msg:"order created"})
    }else{
        if(user.balance >= product.price){
            user.balance = user.balance - product.price
            let updateUser = await user.save()
            order.amount = product.price
            let orderCreated = await orderModel.create(order)
            res.send({msg:"order created"})
        } else{
            res.send({msg: "User has insufficient balance"})
        }
    }

    res.send({msg: "done"})
}

const basicCode= async function(req, res, next) {
    let tokenDataInHeaders= req.headers.token
    console.log(tokenDataInHeaders)

    console.log( "HEADER DATA ABOVE")
    console.log( "hey man, congrats you have reached the Handler")
    //res.send({ msg: "This is coming from controller (handler)"})
    next()
    }

const createUser= async function (req, res) {
    
    let data= req.body
    let tokenDataInHeaders= req.headers.token
    //Get all headers from request
    console.log("Request headers before modificatiom",req.headers)
    //Get a header from request
    console.log(req.headers.batch)
    console.log(req.headers["content-type"])
    console.log(tokenDataInHeaders)
    //Set a header in request
    req.headers['month']='June' //req.headers.month = "June"

    //Set an attribute in request object
    req.anything = "everything"
    
    
    console.log("Request headers after modificatiom",req.headers)
    
    //Set a header in response
    res.header('year','2022')
    res.send({msg: "Hi"})
}*/

const getUsersData= async function (req, res) {
    let allUsers= await UserModel.find()
    res.send({msg: allUsers})
}

module.exports.createUser= createUser
module.exports.getUsersData= getUsersData
module.exports.basicCode= basicCode
module.exports.createOrder= createOrder
