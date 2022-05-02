const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
        productId:String,
        elasticId:String,
        userId:String,
        sellerId:String,
        productName:String,
        img:String,
        category:String,
        description:String,
        price:String,
        quantity:String
})

const Cart = mongoose.model('cart',cartSchema);

module.exports = Cart;