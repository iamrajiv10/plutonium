const userModel = require("../Model/userModel")



const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValidRequestBody = function (object) {
    return Object.keys(object).length > 0;
};

const isValidEmail = function (email) {
    const regexForEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return regexForEmail.test(email);
};

const isValidPhone = function (phone) {
    const regexForMobile = /^[6-9]\d{9}$/;
    return regexForMobile.test(phone);
};

const isNameValid = function (value) {
    let regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
    return regex.test(value)
}






// =================user validation===========================================
const  userValidation = async function(req,res,next){
    try{
     
    let data = req.body;
    if (!isValidRequestBody(data)) {
        return res
            .status(400)
            .send({ status: false, message: "user data is required to create a new user" });
    }
    let{ title, name, phone, email, password, address }=data


    if (!isValid(title)) {
        return res
            .status(400)
            .send({ status: false, message: `title is required and should be valid format like: Mr/Mrs/Miss` });
    }

    if (!["Mr", "Mrs", "Miss"].includes(title.trim())) {
        return res
            .status(400)
            .send({ status: false, message: `title must be provided from these values: Mr/Mrs/Miss`, });
    }

    if (!isValid(name) || !isNameValid(name)) {
        return res
            .status(400)
            .send({ status: false, message: `name is required and should be in valid format ` });
    }

    if (!isValid(phone)) {
        return res
            .status(400)
            .send({ status: false, message: "mobile number is required" });
    }

    if (!isValidPhone(phone)) {
        return res
            .status(400)
            .send({ status: false, message: " please enter a valid 10 digit mobile number" });
    }
    const isPhoneUnique = await userModel.findOne({ phone });

        if (isPhoneUnique) {
            return res
                .status(400)
                .send({ status: false, message: `mobile number: ${phone} already exist` });
        }
    
        if (!isValid(email)) {
            return res
                .status(400)
                .send({ status: false, message: "email address is required" });
        }

        if (!isValidEmail(email)) {
            return res
                .status(400)
                .send({ status: false, message: " please enter a valid email address" });
        }

    const isEmailUnique = await userModel.findOne({ email });

        if (isEmailUnique) {
            return res
                .status(400)
                .send({ status: false, message: `email: ${email} already exist` });
        }
    
        if (!isValid(password)) {
            return res
                .status(400)
                .send({ status: false, message: "password is required" });
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/.test(password)) {
            return res
                .status(400)
                .send({ status: false, message: "password should be: 8 to 15 characters " });
        }

        if (address) {

            if (!isValid(address.street)) {
                return res
                    .status(400)
                    .send({ status: false, message: "invalid street" })
            }

            if (!isValid(address.city) || !isNameValid(address.city)) {
                return res
                    .status(400)
                    .send({ status: false, message: "invalid city" });
            }

            if (! /^\+?([1-9]{1})\)?([0-9]{5})$/.test(address.pincode)) {
                return res
                    .status(400)
                    .send({ status: false, message: "invalid pin" })
            }

        }

      
        next()
        }
        catch (err) {
        return res.status(500).send({ message: err.message })
        }

}
module.exports.userValidation = userValidation
