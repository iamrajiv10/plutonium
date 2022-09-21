const userModel = require('../Model/userModel')
const jwt = require('jsonwebtoken')
const moment = require('moment')



// ----------------------------------------------------- create User ----------------------------------------------------


const createUser = async function (req, res) {

    try {
        const data = req.body
        const userData = await userModel.create(data)
        return res.status(201).send({ status: true, data: userData })
    }

    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//  --------------------------------------------------------- login ----------------------------------------------------------


const login = async function (req, res) {
    try {
        const requestBody = req.body; // it consist email and password

        if (!requestBody.email || !requestBody.password) { return res.status(400).send({ status: false, message: "Credentials missing" }) }


        const user = await userModel.findOne(requestBody)
        if (!user) return res.status(400).send({ status: false, message: "Invalid Credentials!!" })

        let expiration = '7d'
        let token = jwt.sign({
            userId: user._id.toString(),
            topic: "BooksManagement"
        }, 'project-3-group-61',{ expiresIn: expiration });
        let tokenData = {
            token : token,
            userId: user._id,
            iat: moment(),
            exp: expiration
        }
        res.status(200).send({ status: true, message: "Success", data: tokenData })

    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

module.exports.createUser = createUser;
module.exports.login = login;
