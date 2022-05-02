const mongoose = require('mongoose');

const favouritesSchema = mongoose.Schema({
    userId:String,
    productId:String,
    sellerId:String,
    category:String,
    productName:String,
    description:String,
    price:String,
    quantity:String,
    img:String
})

const Favourite = mongoose.model('favourites',favouritesSchema);

module.exports = Favourite;