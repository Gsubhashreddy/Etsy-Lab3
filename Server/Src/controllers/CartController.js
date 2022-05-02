const ProductModel = require('./../models/ProductModel')
const CartModel = require('./../models/CartModel')

exports.addToCart = (req,res) => {
    const {productId,userId,quantity,price} = req.body

    ProductModel.findByProductId({productId},(err,data)=>{
        if(err) return res.status(500).json({message:'Server Error'})

        if(data.length > 0){
            const {elastic_id,seller_id,product_name,img,category,description} = data[0]
            CartModel.addToCart({elastic_id,productId,userId,sellerId:seller_id,productName:product_name,img,category,description,price,quantity},(err,data)=>{
                if(err) return res.status(500).json({message:'Server error'})
                if(data){
                    return res.json({message:'Added to Cart'})
                }
            })
        }
    })
}

exports.getCartItems = (req,res) => {
    const {userId} = req.body
    try {
        CartModel.findByUserId({userId},(err,data)=> {
            if(err) return res.status(500).json({message:'Server Error'})
            if(data)    return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server Error"})
    }
}

exports.removeCartItem = (req,res) => {
    const {userId,productId} = req.body
    try {
        CartModel.deleteByUserIdAndProductId({userId,productId},(err,data)=>{
            if(err)
                return res.status(500).json({message:"Server Error"})
            return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server Error"})
    }
}