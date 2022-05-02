const SellerModel = require('./../models/SellerModel')

exports.createSeller = (req,res) => {
    const {name,email,phNumber,currency,city,country} = req.body
    const ownerId = req.user.id
    try {
        SellerModel.createSeller({ownerId,name,email,phNumber,currency,city,country},(err, data)=>{
            if(err) return res.status(500).json({message:"Server error"})
            return res.json({message:"Shop created"})
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.updateShop = (req,res) => {
    const {sellerId,name,ownerName,email,phNumber,img} = req.body
    console.log("---------------------------",req.body)
    try {
        SellerModel.updateSeller({sellerId,name,ownerName,email,phNumber,img},(err,data)=>{
            console.log(err)
            if(err) return res.status(500).json({message:"Server error: "+err})
            if(data){
                return res.json({message:"Shop Updated"})
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error: "+error})
    }
}

exports.checkAvailability = (req,res) => {
    const {name} = req.body
    try {
        SellerModel.checkShopAvailability({name},(err,data)=>{
            console.log(err)
            if(err) return res.status(500).json({message:"Server error"})

            if(data.length > 0){
                return res.status(201).json({message:"Name not Available"})
            }
            
            return res.json({message:"Name Available"})
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getShopByName = (req,res) => {
    const {name} = req.body
    try {
        SellerModel.findyByShopName({name},(err,data)=>{
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

exports.myShops = (req,res) => {
    const {ownerId} = req.body
    try {
        SellerModel.myShops({ownerId},(err,data)=>{
            if(err)
                return res.status(500).json({message:"Server error"})
            if(data)
                return res.json(data)
        })
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