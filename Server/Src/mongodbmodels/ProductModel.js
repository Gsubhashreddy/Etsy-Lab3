const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productId:String,
    sellerId:String,
    productName:String,
    category:String,
    description:String,
    price:String,
    quantity:String,
    img:String,
    sales:{
        type:Number,
        default:0
    }
})

const Product = mongoose.model('product',productSchema);

module.exports = Product;