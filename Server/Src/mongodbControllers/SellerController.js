const Seller = require('../mongodbmodels/SellerModel');
const uuid = require('uuid').v4

exports.createSeller = async(req,res) => {
    const id = uuid();
    const {name,email,phNumber,currency,city,country} = req.body
    console.log(req.user)
    const ownerId = req.user.id;
    const sellerId = id;
    try {
        const seller = await Seller.create({sellerId,ownerId,name,email,phNumber,currency,city,country})
        if(seller){
            return res.json({message:"Shop created"})
        }
        else{
            return res.json({message:"Shop not created"})
        }
        // SellerModel.createSeller({ownerId,name,email,phNumber,currency,city,country},(err, data)=>{
        //     if(err) return res.status(500).json({message:"Server error"})
        //     return res.json({message:"Shop created"})
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.updateShop = async(req,res) => {
    const {sellerId,name,ownerName,email,phNumber,img} = req.body
    console.log("---------------------------",req.body)
    try {
        const seller = await Seller.find({sellerId});
        const id = seller[0]?._id;
        const updatedSeller=await Seller.findByIdAndUpdate(id,{name,ownerName,email,phNumber,img})
        if(updatedSeller)
            return res.json({message:"Shop Updated"})
        return res.status(500).json({message:"Server error: "})
        // SellerModel.updateSeller({sellerId,name,ownerName,email,phNumber,img},(err,data)=>{
        //     console.log(err)
        //     if(err) return res.status(500).json({message:"Server error: "+err})
        //     if(data){
        //         return res.json({message:"Shop Updated"})
        //     }
        // })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error: "+error})
    }
}

exports.checkAvailability = async(req,res) => {
    const {name} = req.body
    try {
        const sellers= await Seller.find({name});
        if(sellers.length>0){
            return res.status(201).json({message:"Name not Available"}) 
        }
        return res.json({message:"Name Available"})
        // SellerModel.checkShopAvailability({name},(err,data)=>{
        //     console.log(err)
        //     if(err) return res.status(500).json({message:"Server error"})

        //     if(data.length > 0){
        //         return res.status(201).json({message:"Name not Available"})
        //     }
            
        //     return res.json({message:"Name Available"})
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getShopByName = async(req,res) => {
    const {name} = req.body
    try {
        const sellers= await Seller.find({name});
        if(sellers.length>0){
            return res.json(sellers[0])
        }
        return res.status(404).json({message:"Not Found"})
        // SellerModel.findyByShopName({name},(err,data)=>{
        //     console.log(err)
        //     if(err) return res.status(500).json({message:"Server error"})

        //     if(data.length > 0){
        //         return res.json(data[0])
        //     }

        //     return res.status(404).json({message:"Not Found"})
        // })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"})
    }
}

exports.myShops = async(req,res) => {
    const {ownerId} = req.body
    try {
        const shops = await Seller.find({ownerId})
        if(shops)
            return res.json(shops)
        // SellerModel.myShops({ownerId},(err,data)=>{
        //     if(err)
        //         return res.status(500).json({message:"Server error"})
        //     if(data)
        //         return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}


exports.getShopBySellerId = (req,res) => {
    const {sid} = req.body
    try {
        SellerModel.findById({sid},(err,data)=>{
            console.log(err)
            if(err) return res.status(500).json({message:"Server error"})

            if(data.length > 0){
                return res.json(data[0])
            }

            return res.status(404).json({message:"Not Found"})
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"})
    }
}