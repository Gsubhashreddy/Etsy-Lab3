var db = require('../../config/db')

exports.add = ({id,productId,sellerId,category,productName,description,price,quantity,img},result) => {
    const sql = `insert into favorites(id, product_id,seller_id,category,product_name,description,price,quantity,img)
                values('${id}','${productId}','${sellerId}','${category}','${productName}','${description}','${price}','${quantity}','${img}')`
    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

exports.remove = ({id,productId},result) => {
    const sql = `delete from favorites where id = '${id}' and product_id = '${productId}'`
    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

exports.findbyId = ({id},result) => {
    console.log(id)
    const sql = `select * from favorites where id = '${id}'`
    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

exports.findByIdAndProductId = ({id,productId},result) => {
    const sql =  `select * from favorites where id = '${id}' and product_id = '${productId}'`
    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}