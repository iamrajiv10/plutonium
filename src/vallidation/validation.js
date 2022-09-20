const userModel = require("../Model/userModel")

function isEnum(value) {
    if (typeof value !== "string") { return false }
    else {
        let titles = ["Mr", "Mrs", "Miss"]
        for (let i = 0; i < titles.length; i++) {
            if (titles[i] == value.trim()) { return true }
        }
        return false
    }
}


// =================user validation===========================================
const  userValidation = async function(req,res,next){
    try{
     
    let data = req.body;
    let{ title, name, phone, email, password, address }=data
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Data is mandatory" })

    if (!title) return res.status(400).send({ status: false, message: "Title is mandatory" })
    if (!isEnum(title)) return res.status(400).send({ status: false, message: 'Invalid Title ,available tiltes ( Mr, Mrs, Miss)' })

    if(!name){return res.status(400).send({status:false,message:"Please provide the name"})}
    if(typeof name==='string' && name.trim().length === 0){return res.status(400).send({status:false,message:"name is empty"})}
    if(typeof name !== 'string') {return res.status(400).send({status:false,message:"name should be string"})}
    if (!(/^[a-zA-Z ]{2,30}$/).test(name)) return res.status(400).send({ status: false, message: " Please enter name as A-Z or a-z" })

    if(!phone){return res.status(400).send({status:false,message:"Please provide the phone number"})}
    if(typeof phone==='string' && phone.trim().length === 0){return res.status(400).send({status:false,message:"phone number is empty"})}
    if(typeof phone !== 'string') {return res.status(400).send({status:false,message:"phone number should be string"})}
    if (!(/^[0]?[6789]\d{9}$/).test(phone.trim())) { return res.status(400).send({ status: false, message: "Please provide valid phone number" }) }

    let phoneNoCheck = await userModel.findOne({ phone: phone})
    if (phoneNoCheck ) { return res.status(400).send({ status: false, message: "This phone number is already registerd" }) }
    

    if(!email){return res.status(400).send({status:false,message:"Please provide the email"})}
    if(typeof email==='string' && email.trim().length === 0){return res.status(400).send({status:false,message:"email is empty"})}
    if(typeof email !== 'string') {return res.status(400).send({status:false,message:"email should be string"})}
    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(email.trim())) { return res.status(400).send({ status: false, message: "Please provide valid email" }) }

    let user = await userModel.findOne({ email: email })
    if (user) { return res.status(400).send({ status: false, message: "This email already exists please provide another email" }) }

    if(!password){return res.status(400).send({status:false,message:"Please provide the password"})}
    if(typeof password==='string' && password.trim().length === 0){return res.status(400).send({status:false,message:"password is empty"})}
    if(typeof password !== 'string') {return res.status(400).send({status:false,message:"password should be string"})}
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/).test(password.trim())) { return res.status(400).send({ status: false, message: "Please provide valid password" }) }
    
    if(address)
    {
    if(!address.street){return res.status(400).send({status:false,message:"Please provide the street"})}
    if(typeof address.street==='String' && address.street.trim().length === 0){return res.status(400).send({status:false,message:"street is empty"})}
    if(typeof address.street !== 'string') {return res.status(400).send({status:false,message:"street should be string"})}
    // if (!(/^[a-zA-Z0-9-]*[a-zA-Z0-9]+(?:, [a-zA-Z0-9-]*[a-zA-Z0-9]+)*$/).test(address.street.trim())) 
    // { return res.status(400).send({ status: false, message: "Please provide valid street" }) }

    if(!address.city){return res.status(400).send({status:false,message:"Please provide the city"})}
    if(typeof address.city==='string' && address.city.trim().length === 0){return res.status(400).send({status:false,message:"city is empty"})}
    if(typeof address.city !== 'string') {return res.status(400).send({status:false,message:"city should be string"})}
    if (!(/^[a-zA-Z ]{2,30}$/).test(address.city.trim())) { return res.status(400).send({ status: false, message: "Please provide valid city" }) }

    if(!address.pincode){return res.status(400).send({status:false,message:"Please provide the pincode"})}
    if(typeof address.pincode==='string' && address.pincode.trim().length === 0){return res.status(400).send({status:false,message:"pincode is empty"})}
    if(typeof address.pincode !== 'string') {return res.status(400).send({status:false,message:"pincode should be string"})}
    if (!(/^[1-9][0-9]{5}$/).test(address.pincode.trim())) { return res.status(400).send({ status: false, message: "Please provide valid pincode" }) }
}
      
    next()
    }
    catch (err) {
    return res.status(500).send({ message: err.message })
  }

}
module.exports.userValidation = userValidation