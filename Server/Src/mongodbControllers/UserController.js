const User = require('../mongodbmodels/UserModal');
const Favourite = require('../mongodbmodels/FavouritesModal');
const Product = require('../mongodbmodels/ProductModel');
const jwt = require('jsonwebtoken')
const config = require('../../config/constants')
const bcrypt = require('bcrypt')

exports.createUser = async(req,res)=>{
    try{
        console.log(req.body);
        const { registrationemail, registrationfirstName, registrationpassword } = req.body;
        const salt = await bcrypt.genSalt(10)
        const encrypted = await bcrypt.hash(registrationpassword, salt)
        const user = await User.create({
            firstName:registrationfirstName,
            email:registrationemail,
            password:encrypted
        })
        const payload = {
            user: {
                id: user
            }
        }
        jwt.sign(
            payload,
            config.jwtSecret,
            {
                expiresIn: 3600
            },
            (err, token) => {
                if (err) throw err
                return res.json({ token })
            }
        )
    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
}

exports.updateUser=async(req,res)=>{
    const id = req.body.id;
    try{
        const user=await User.findByIdAndUpdate(id,req.body)
        res.json({
            message:'user data updated successfully...'
        })
    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
}

exports.myFavorites = async(req,res) => {
    const {id} = req.body
    try {
        const favourites = await Favourite.find({userId:id});
        if(favourites){
            return res.json(favourites)
        }
        // FavoritesModel.findbyId({id},(err,data)=>{
        //     if(err){
        //         return res.status(500).json({message:'Server error'})
        //     }
        //     return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.addToFavorites = async(req, res) => {
    const { id, productId } = req.body
    try {
        const favourites=await Favourite.find({userId:id,productId})
        if(favourites.length===0){
            const product= await Product.findById(productId)
            if(product){
                const favoritesData = {
                                        userId:id,
                                        productId,
                                        sellerId: product.sellerId,
                                        productName: product.productName,
                                        category: product.category,
                                        description: product.description,
                                        price: product.price,
                                        quantity: product.quantity,
                                        img:product.img
                }
                const favourite=await Favourite.create(favoritesData);
                if(favourite){
                    return res.json({ message: "Added to Favorites" })
                }
            }
            else{
                return res.status(400).json({ message: "Product does not exists" })
            }
        }
        else{
            return res.status(400).json({ message: "Already added to favorites!" })
        }
        // FavoritesModel.findByIdAndProductId({ id, productId }, (err, data) => {
        //     if (err) return res.status(500).json({ message: 'Server error: ' + err })
        //     if (data.length == 0) {
        //         ProductModel.findByProductId({ productId }, (err, data) => {
        //             if (err) return res.status(500).json({ message: 'Server error: ' + err })
        //             if (data.length > 0) {
        //                 const product = data[0]
        //                 const favoritesData = {
        //                     id,
        //                     productId,
        //                     sellerId: product.seller_id,
        //                     productName: product.product_name,
        //                     category: product.category,
        //                     description: product.description,
        //                     price: product.price,
        //                     quantity: product.quantity,
        //                     img:product.img
        //                 }
        //                 FavoritesModel.add(favoritesData, (err, data) => {
        //                     console.log(err)
        //                     if (err) return res.status(500).json({ message: "Serve error: " + err })
        //                     return res.json({ message: "Added to Favorites" })
        //                 })
        //             } else {
        //                 return res.status(400).json({ message: "Product does not exists" })
        //             }
        //         })
        //     } else {
        //         return res.status(400).json({ message: "Already added to favorites!" })
        //     }
        // })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.removeFromFavorites = async(req,res) => {
    const {id,productId} = req.body
    try {
        //const favorites = await Favourite.find({userId:id,productId}) 
        const item = await Favourite.deleteOne({userId:id,productId});
        if(item){
            console.log(item)
            return res.json(item)
        }
        // if(favorites.length>0){
        //     await Favourite.remove({userId:id,productId})
        // }
        // FavoritesModel.remove({id,productId},(err,data)=>{
        //     if(err) 
        //         return res.status(500).json({message:"Server Error"})
        //     if(data)
        //         return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.searchFavorite = async(req,res) => {
    const id = req.params.id
    const productId = req.params.productId
    try {
        const fav_product = await Favourite.findOne({userId:id,productId});
        if(fav_product)
            return res.json(product)
        else{
            return res.status(404).json({message:"Product does not exist!"}) 
        }
        // FavoritesModel.findByIdAndProductId({id,productId},(err,data)=>{
        //     if(err) return res.status(500).json({message:"Server error: "+err})
        //     console.log(data)
        //     if(data.length>0){
        //         const product = data[0]
        //         return res.json(product)
        //     }
        //     return res.status(404).json({message:"Product does not exist!"})
        // })
    } catch (error){
        return res.status(500).json({message:"Server error: "+error})
    }
}