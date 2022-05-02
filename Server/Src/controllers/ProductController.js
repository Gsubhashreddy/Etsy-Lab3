const ProductModel = require('./../models/ProductModel')
const elasticClient = require('./../../config/ElasticClient')

exports.create = (req,res)=>{
    const {sellerId,name,category,description,price,quantity,img} = req.body
    try {
        ProductModel.createProduct({sellerId,name,category,description,price,quantity,img},(err,data)=>{
            if(err) return res.status(500).json({message:"Server error : \n"+ err})
            return res.json({message:"Product added"})
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getProduct = (req,res) => {
    console.log(req.params.search)
    const searchParameter = req.params.search
    try {
        ProductModel.searchProduct({searchParameter},(err,data)=>{
            if(err) return res.status(500).json({message:"Server error : \n"+ err})
            return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
    // let query = {
    //     index : 'products'
    // }
    // if(searchParameter){
    //     query.q = `*${searchParameter}*`
    // }
    // elasticClient.search(query).then(resp=>{
    //     return res.json({
    //         products: resp.hits.hits
    //     })
    // }).catch(err=>{
    //     console.log(err)
    //     return res.status(500).json({
    //         message:err
    //     })
    // })

}   

exports.editProduct = (req,res) => {
    const {productId,name,category,description,price,quantity,img} = req.body
    try {
        console.log(productId,name,category,description,price,quantity,img)
        ProductModel.editProduct({productId,name,category,description,price,quantity,img},(err,data)=>{
            console.log(err)
            if(err) return res.status(500).json({message:"Server error : \n"+ err})
            if(data)
                return res.json({message:"Product updated"})
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getItems = (req,res) => {
    const {sellerId} = req.body
    try {
        ProductModel.getProducts({sellerId},(err,data)=>{
            if(err)
                return res.status(500).json({message:"Server error"+err})
            if(data)
                return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"+error})
    }
}

exports.getProducts = (req,res) => {
    try {
        ProductModel.getAll({},(err,data)=>{
            if(err) return res.status(500).json({message:"Server Error"})
            if(data)   return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getProductById = (req,res) => {
    const productId = req.params.id
    try {
        ProductModel.findByProductId({productId},(err,data)=>{
            if(err) return res.status(500).json({message:"Server error"})
            if(data)
                return res.json(data[0])
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getProductsByCategory = (req,res) => {
    const {category} = req.body
    try {
        ProductModel.getProductsByCategory({category},(err,data) => {
            if(err) return res.status(500).json({message:"Server Error"})
            if(data)
                return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getFIlteredProducts = (req,res) => {
    const {category,price} = req.body
    try {
        ProductModel.getProductsByFilter({category,price},(err,data)=>{
            if(err) return res.status(500).json({message:"Server Error"+err})
            return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server Error"+ error})
    }
}

exports.filteredProductsSortByPrice = (req,res) => {
    const {category,price,order} = req.body
    try {
        ProductModel.productsSortByPrice({category,price,order},(err,data)=>{
            if(err) return res.status(500).json({message:"Server Error"+err})
            return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server Error"+error})
    }
}

exports.filteredProductsSortByQuantity = (req,res) => {
    const {category,price,quantity,order} = req.body
    try {
        ProductModel.productsSortByQuantity({category,price,quantity,order},(err,data)=>{
            if(err) return res.status(500).json({message:"Server Error"})
            return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server Error"})
    }
}

exports.filteredProductsSortBySales = (req,res) => {
    const {category,price,order} = req.body
    try {
        ProductModel.productsSortBySales({category,price,order},(err,data)=>{
            if(err) return res.status(500).json({message:"Server Error"})
            return res.json(data)
        })
    } catch (error) {
        return res.status(500).json({message:"Server Error"})
    }
}