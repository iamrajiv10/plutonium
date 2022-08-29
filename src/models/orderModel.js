const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const orderSchema = new mongoose.Schema( {
    userId: {
        type: ObjectId,
        ref: 'UserDocument'
    },
    productId: {
        type: ObjectId,
        ref: 'ProductDocument'
    },
    amont: Number,
    date: String,
    isFreeAppUser:{
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('OrderDocument', orderSchema)