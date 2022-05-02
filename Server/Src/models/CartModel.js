var db = require('../../config/db')
const uuid = require('uuid').v4

exports.addToCart = ({elastic_id,productId,userId,sellerId,productName,img,category,description,price,quantity},result) => {
    const id = uuid()
    const sql = `insert into cart (
        id,
        product_id,
        elastic_id,
        user_id,
        seller_id,
        product_name,
        img,
        category,
        description,
        price,
        quantity
    ) values(
        '${id}',
        '${productId}',
        '${elastic_id}',
        '${userId}',
        '${sellerId}',
        '${productName}',
        '${img}',
        '${category}',
        '${description}',
        '${price}',
        '${quantity}'
    )`

    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

exports.findByUserId = ({userId},result) => {
    const sql = `select * from cart where user_id = '${userId}'`
    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

exports.deleteByUserId = ({userId},result) => {
    const sql = `delete from cart where user_id = '${userId}'`
    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

exports.deleteByUserIdAndProductId = ({userId,productId},result) => {
    const sql = `delete from cart where user_id = '${userId}' and product_id = '${productId}'`
    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}
