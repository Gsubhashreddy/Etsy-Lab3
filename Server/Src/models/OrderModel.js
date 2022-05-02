var db = require('../../config/db')
const uuid = require('uuid').v4

const ProductModel = require('./../models/ProductModel')
const SellerModel = require('./../models/SellerModel')
const UserModel = require('./../models/UserModel')

exports.placeOrder = ({productId,userId,price,quantity,date},result) => {
    const orderId = uuid()
    const orderModel = {}
    orderModel['orderId'] = orderId
    orderModel['productId'] = productId
    orderModel['quantity'] = quantity
    orderModel['price'] = price
    orderModel['userId'] = userId
    orderModel['date'] = date
    console.log("------date---",date)

    //Get the Product details
    ProductModel.findByProductId({productId},(err,data)=>{
        if(err) return result(err,null)
        if(data.length > 0) {
            const {product_name, seller_id, img, category, description} = data[0]
            orderModel['productName'] = product_name
            orderModel['productImg'] = img
            orderModel['category'] = category
            orderModel['description'] = description

            //Get Shop details
            SellerModel.findById({sellerId:seller_id},(err,data)=>{
                if(err) return result(err,null)
                if(data){
                    const {owner_id,name,owner_name,email,ph_number,img} = data
                    orderModel['sellerId']=seller_id
                    orderModel['ownerId']=owner_id
                    orderModel['shopName']=name
                    orderModel['ownerName']=owner_name
                    orderModel['ownerEmail']=email
                    orderModel['phNumber']=ph_number
                    orderModel['shopImg']=img

                    //Get User details
                    UserModel.findById({id:userId},(err,data)=>{
                        if(err) return result(err,null)
                        if(data.length > 0){
                            const {first_name,last_name,email} = data[0]
                            orderModel['firstName']=first_name
                            orderModel['lastName']=last_name
                            orderModel['userEmail']=email
                            
                            const sql = `insert into orders (
                                order_id,
                                product_id,
                                product_name,
                                product_img,
                                category,
                                description,
                                price,
                                quantity,
                                user_id,
                                first_name,
                                last_name,
                                user_email,
                                seller_id,
                                owner_id,
                                shop_name,
                                owner_name,
                                owner_email,
                                ph_number,
                                shop_img,
                                date
                            ) values (
                                '${orderModel['orderId']}',
                                '${orderModel['productId']}',
                                '${orderModel['productName']}',
                                '${orderModel['productImg']}',
                                '${orderModel['category']}',
                                '${orderModel['description']}',
                                '${orderModel['price']}',
                                '${orderModel['quantity']}',
                                '${orderModel['userId']}',
                                '${orderModel['firstName']}',
                                '${orderModel['lastName']}',
                                '${orderModel['userEmail']}',
                                '${orderModel['sellerId']}',
                                '${orderModel['ownerId']}',
                                '${orderModel['shopName']}',
                                '${orderModel['ownerName']}',
                                '${orderModel['ownerEmail']}',
                                '${orderModel['phNumber']}',
                                '${orderModel['shopImg']}',
                                '${orderModel['date']}'
                            )`
                            db.query(sql,(err,res)=>{
                                console.log(err)
                                if(err){
                                    result(err,null)
                                }else{    
                                    result(null,orderModel)
                                }
                            })
                        }else{
                            return result("User Not found",null)
                        }
                    })
                }
            })
        }else{
            return result(err,null)
        }
    })
}   

exports.myOrders = ({id},result) => {
    const sql  = `select * from orders where user_id = '${id}'`
    db.query(sql,(err,res)=>{
        if(err) result(err,null)
        else    result(null,res)
    })
}