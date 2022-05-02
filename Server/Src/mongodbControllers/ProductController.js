const Product = require('../mongodbmodels/ProductModel');

exports.create = async(req,res)=>{
    try{
        const product = await Product.create(req.body);
        res.status(201).json({
            status:'success',
            product,
            message:'Product added...'
        })
    }catch(err){
        res.json({
            message:err.message
        })
    }
}

exports.getProduct = async(req,res)=>{
    const searchParameter = req.params.search
    try {
        const data=await Product.find({productName:{"$regex":".*"+ searchParameter + ".*",'$options' : 'i'}});
        console.log(data,searchParameter)
        return res.json(data)
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getProducts = async(req,res) => {
    try {
        const products = await Product.find();
        console.log(products)
        if(products)    
            return res.json(products)
        
        // ProductModel.getAll({},(err,data)=>{
        //     if(err) return res.status(500).json({message:"Server Error"})
        //     if(data)   return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getProductsByCategory = async(req,res) => {
    const {category} = req.body
    console.log(req.body)
    try {
        const products = await Product.find({category})
        if(products){
            return res.json(products)
        }
        // ProductModel.getProductsByCategory({category},(err,data) => {
        //     if(err) return res.status(500).json({message:"Server Error"})
        //     if(data)
        //         return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}
exports.getItems = async(req,res) => {
    const {sellerId} = req.body
    try {
        const products = await Product.find({sellerId})
        if(products){
            return res.json(products)
        }
        return res.status(500).json({message:"Server error"});
        // ProductModel.getProducts({sellerId},(err,data)=>{
        //     if(err)
        //         return res.status(500).json({message:"Server error"+err})
        //     if(data)
        //         return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"+error})
    }
}
exports.editProduct = async(req,res) => {
    const {productId,productName,category,description,price,quantity,img} = req.body
    try {
        const product = await Product.findByIdAndUpdate(productId,{productName,category,description,price,quantity,img})
        if(product)
            return res.json({message:'Product updated...'})
        // console.log(productId,productName,category,description,price,quantity,img)
        // ProductModel.editProduct({productId,productName,category,description,price,quantity,img},(err,data)=>{
        //     console.log(err)
        //     if(err) return res.status(500).json({message:"Server error : \n"+ err})
        //     if(data)
        //         return res.json({message:"Product updated"})
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getProductById = async(req,res) => {
    const productId = req.params.id
    try {
        const product = await Product.findById(productId)
        console.log(product,'line 100')
        if(product)
            return res.json(product)
        // ProductModel.findByProductId({productId},(err,data)=>{
        //     if(err) return res.status(500).json({message:"Server error"})
        //     if(data)
        //         return res.json(data[0])
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getFIlteredProducts = async(req,res) => {
    const {category,price} = req.body
    try {
        const products = await Product.find({category,price})
        if(products.length>0)
            return res.json(products)
        else{
            return res.status(500).json({message:"No products found..."})
        }
        // ProductModel.getProductsByFilter({category,price},(err,data)=>{
        //     if(err) return res.status(500).json({message:"Server Error"+err})
        //     return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server Error"+ error})
    }
}

exports.filteredProductsSortByPrice = async(req,res) => {
    const {category,price,order} = req.body
    try {
        const products = await Product.find({category}).sort({price:order});
        console.log(products,'line 136',req.body)
        if(products)
            return res.json(products)
        // ProductModel.productsSortByPrice({category,price,order},(err,data)=>{
        //     if(err) return res.status(500).json({message:"Server Error"+err})
        //     return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server Error"+error})
    }
}

exports.filteredProductsSortByQuantity = async(req,res) => {
    const {category,price,quantity,order} = req.body
    try {
        const products = await Product.find({category}).sort({quantity:order});
        if(products)
            return res.status(201).json(products)
        // ProductModel.productsSortByQuantity({category,price,quantity,order},(err,data)=>{
        //     if(err) return res.status(500).json({message:"Server Error"})
        //     return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server Error"})
    }
}

exports.filteredProductsSortBySales = async(req,res) => {
    const {category,sales,order} = req.body
    try {
        const products = await Product.find({category}).sort({sales:order});
        if(products)
            return res.status(201).json(products)
        // ProductModel.productsSortBySales({category,price,order},(err,data)=>{
        //     if(err) return res.status(500).json({message:"Server Error"})
        //     return res.json(data)
        // })
    } catch (error) {
        return res.status(500).json({message:"Server Error"})
    }
}