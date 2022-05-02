const Cart = require('../mongodbmodels/CartModel');
const Product = require('../mongodbmodels/ProductModel');

exports.addToCart = async(req,res) => {
    try{
        const {productId,userId,quantity,price} = req.body
        const product = await Product.findById(productId);
        if(!product) return res.status(500).json({message:'Server Error'})
        if(product){
            const {sellerId,productName,img,category,description} = product;
            const cart_item=await Cart.create({
                productId,
                userId,
                sellerId,
                productName,
                img,category,
                description,
                price,
                quantity
            })
            if(cart_item){
                return res.json({message:'Added to Cart'})
            }
        }
    }catch(err){
        return res.status(500).json({message:"Server Error"})
    }
    // ProductModel.findByProductId({productId},(err,data)=>{
    //     if(err) return res.status(500).json({message:'Server Error'})

    //     if(data.length > 0){
    //         const {elastic_id,seller_id,product_name,img,category,description} = data[0]
    //         CartModel.addToCart({elastic_id,productId,userId,sellerId:seller_id,productName:product_name,img,category,description,price,quantity},(err,data)=>{
    //             if(err) return res.status(500).json({message:'Server error'})
    //             if(data){
    //                 return res.json({message:'Added to Cart'})
    //             }
    //         })
    //     }
    // })
}

exports.getCartItems = async(req,res) => {
    const {userId} = req.body
    try {
        const data = await Cart.find({userId})
        console.log(data)
        if(!data) return res.status(500).json({message:'Server Error'})
        if(data){
            return res.json(data);
        }
        // CartModel.findByUserId({userId},(err,data)=> {
        //     if(err) return res.status(500).json({message:'Server Error'})
        //     if(data)    return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server Error"})
    }
}

exports.removeCartItem = async(req,res) => {
    const {userId,productId} = req.body
    console.log(req.body)
    try {
        const cart_item=await Cart.find({userId,productId})
        console.log('cart-item',cart_item)
        if(cart_item){
            const deleted_item=await Cart.findByIdAndDelete(cart_item[0]._id)
            if(deleted_item)
                return res.json(deleted_item)
        }
        return res.status(500).json({message:"Server Error"})
        
        // CartModel.deleteByUserIdAndProductId({userId,productId},(err,data)=>{
        //     if(err)
        //         return res.status(500).json({message:"Server Error"})
        //     return res.json(data)
        // })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error"})
    }
}