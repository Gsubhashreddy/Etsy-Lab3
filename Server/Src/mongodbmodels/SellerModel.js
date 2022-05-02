const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    sellerId:String,
    ownerId:String,
    ownerName:String,
    name:String,
    email:String,
    phNumber:String,
    currency:String,
    city:String,
    country:String,
    img:String,
    sales:{
        type:Number,
        default:0
    }
})

const Seller= mongoose.model('seller',sellerSchema);

module.exports = Seller;