const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderId:String,
    productId:String,
    productName:String,
    productImg:String,
    category:String,
    description:String,
    price:String,
    quantity:String,
    userId:String,
    firstName:String,
    lastName:String,
    userEmail:String,
    sellerId:String,
    ownerId:String,
    shopName:String,
    ownerName:String,
    ownerEmail:String,
    phNumber:String,
    shopImg:String,
    date:String,
    giftMsg:String
})

const Order= mongoose.model('order',orderSchema);

module.exports = Order;