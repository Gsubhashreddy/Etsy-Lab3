const UserModel = require('../models/UserModel')
const ProductModel = require('./../models/ProductModel')
const FavoritesModel = require('./../models/FavoritesModel')
const jwt = require('jsonwebtoken')
const config = require('../../config/constants')
const bcrypt = require('bcrypt')

exports.createUser = async (req, res) => {
    const { registrationfirstName, registrationemail, registrationpassword } = req.body;
    
    try {
        UserModel.findByEmail({ email:registrationemail }, async (err, data) => {
            if (err) res.status(500).json({ message: "Server error" })

            

            if (data.length > 0) {
                return res.status(400).json({ message: "User exists" })
            }
            const salt = await bcrypt.genSalt(10)
            const encrypted = await bcrypt.hash(registrationpassword, salt)
            UserModel.createUser({ registrationfirstName, registrationemail, encrypted }, (err, data) => {
                const payload = {
                    user: {
                        id: data
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
            })
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

exports.updateUser = (req, res) => {
    const {
        id,
        firstName,
        lastName,
        email,
        contactNumber,
        gender,
        dob,
        city,
        address,
        zipcode,
        country,
        about,
        profileImg
    } = req.body
    // if (!req.file) {
    //     console.log("No file upload");
    // } else {
    //     console.log(req.file.filename)
    //     var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
    //     var insertData = `UPDATE users SET profileImg=${imgsrc} WHERE id = ${id}`
    //     db.query(insertData, [imgsrc], (err, result) => {
    //         if (err) throw err
    //         console.log("file uploaded")
    //     })
    // }
    try {
        UserModel.findById({id}, (err, data) => {
            if (err) return res.status(500).json({ message: 'Server error' })
            if (data.length > 0) {
                const user = data[0]
                const id = user.id
                UserModel.updateUser({
                    id, firstName,
                    lastName,
                    email,
                    contactNumber,
                    gender,
                    dob,
                    city,
                    address,
                    zipcode,
                    country, about, profileImg
                }, (err, data) => {
                    if (err) throw err
                    if (data) {
                        return res.json({ message: "User Updated" })
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).json({ message: 'Server error' })
    }
}

exports.addToFavorites = (req, res) => {
    const { id, productId } = req.body
    try {
        FavoritesModel.findByIdAndProductId({ id, productId }, (err, data) => {
            if (err) return res.status(500).json({ message: 'Server error: ' + err })
            if (data.length == 0) {
                ProductModel.findByProductId({ productId }, (err, data) => {
                    if (err) return res.status(500).json({ message: 'Server error: ' + err })
                    if (data.length > 0) {
                        const product = data[0]
                        const favoritesData = {
                            id,
                            productId,
                            sellerId: product.seller_id,
                            productName: product.product_name,
                            category: product.category,
                            description: product.description,
                            price: product.price,
                            quantity: product.quantity,
                            img:product.img
                        }
                        FavoritesModel.add(favoritesData, (err, data) => {
                            console.log(err)
                            if (err) return res.status(500).json({ message: "Serve error: " + err })
                            return res.json({ message: "Added to Favorites" })
                        })
                    } else {
                        return res.status(400).json({ message: "Product does not exists" })
                    }
                })
            } else {
                return res.status(400).json({ message: "Already added to favorites!" })
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

exports.removeFromFavorites = (req,res) => {
    const {id,productId} = req.body
    try {
        FavoritesModel.remove({id,productId},(err,data)=>{
            if(err) 
                return res.status(500).json({message:"Server Error"})
            if(data)
                return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.myFavorites = (req,res) => {
    const {id} = req.body
    try {
        FavoritesModel.findbyId({id},(err,data)=>{
            if(err){
                return res.status(500).json({message:'Server error'})
            }
            return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.searchFavorite = (req,res) => {
    const id = req.params.id
    const productId = req.params.productId
    try {
        FavoritesModel.findByIdAndProductId({id,productId},(err,data)=>{
            if(err) return res.status(500).json({message:"Server error: "+err})
            console.log(data)
            if(data.length>0){
                const product = data[0]
                return res.json(product)
            }
            return res.status(404).json({message:"Product does not exist!"})
        })
    } catch (error){
        return res.status(500).json({message:"Server error: "+error})
    }
}