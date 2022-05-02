var db = require('../../config/db')
const uuid = require('uuid').v4

exports.createSeller = ({ownerId,name,email,phNumber,currency,city,country},result) => {
    const id = uuid()
    const sql = `insert into seller(seller_id, owner_id, name, email, ph_number, currency, city, country)
                values('${id}','${ownerId}','${name}','','','${currency}','${city}','${country}')`
    db.query(sql,(err,res)=>{
        if(err) {
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

exports.myShops = ({ownerId},result) => {
    const sql = `select * from seller where owner_id = '${ownerId}'`
    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

exports.updateSeller = ({sellerId,name,ownerName,email,phNumber,img},result) => {
    console.log("model body: ", {sellerId,name,ownerName,email,phNumber,img})
    const sql = `update seller set name = '${name}', owner_name='${ownerName}', email='${email}', ph_number='${phNumber}', img='${img}' where seller_id = '${sellerId}'`
    db.query(sql,(err,res)=>{
        console.log('---------err:',err)
        console.log('---------res:',res)
        if(err) {
            result(err,null)
        }else{
            result(null,{sellerId,name,ownerName,email,phNumber,img})
        }
    })
}

exports.checkShopAvailability = ({name},result) => {
    const sql = `select * from seller where name ='${name}'`
    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

exports.findyByShopName = ({name},result) => {
    const sql = `select * from seller where name ='${name}'`
    db.query(sql,(err,res)=>{
        if(err){
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

exports.findById = ({sellerId},result) => {
    const sql = `select * from seller where seller_id = '${sellerId}'`
    db.query(sql,(err,data)=>{
        if(err){
            result(err,null)
        }else{
            result(null,data[0])
        }
    })
}

exports.incrementSales = ({sellerId,quantity},result) => {
    const salessql = `select sales from seller where seller_id = '${sellerId}'`
    db.query(salessql,(err,res)=>{
        if(err){    
            return result(err,null)
        }
        console.log("seller id-----",sellerId)
        const {sales} = res[0]
        const sql = `update seller set sales = '${sales + parseInt(quantity)}' where seller_id = '${sellerId}'`
        db.query(sql,(err,res)=>{
            if(err){
                result(err,null)
            }
            else{
                result(null,res)
            }
        })
    })
}