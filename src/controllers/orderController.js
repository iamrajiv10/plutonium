const orderModel = require("../models/orderModel")
const userModel = require("../models/userModel")
const productModel= require("../models/ProductModel")

const createOrder = async function (req, res) {
    let data = req.body
    let userId = data.userId
    let productId = data.productId
    let orderId = data.orderId
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
    let order={
         isFreeAppUser: headerValue,
         productId:productId,
         userId: userId
    }
    if(headerValue) {
        order.amount = 0
        let orderCreated = await orderModel.create(orderId)
       // res.send({msg:"order created"})
    }else{
        if(user.balance >= product.price){
            user.balance = user.balance - product.price
            let updateUser = await user.save()
            order.amount = product.price
            let orderCreated = await orderModel.create(order)
           // res.send({msg:"order created"})
        } else{
            res.send({msg: "User has insufficient balance"})
        }
    }

    res.send({msg: "done"})
}

module.exports.createOrder = createOrder