const Cart = require('../mongodbmodels/CartModel');
const Order = require('../mongodbmodels/OrderModel');
const Product = require('../mongodbmodels/ProductModel');
const Seller = require('../mongodbmodels/SellerModel');
const User = require('../mongodbmodels/UserModal');
const uuid = require('uuid').v4;
exports.myOrders = async(req,res) => {
    try{
        const {id} = req.body
        const orders = await Order.find({userId:id})
        if(orders)
            return res.json(orders)
    }
    catch(err){
        return res.status(500).json({message:'Server Error'})
    }
    // OrderModel.myOrders({id},(err,data)=>{
    //     if(err) return res.status(500).json({message:'Server Error'})
    //     return res.json(data)
    // })
}

exports.placeOrder = async(req,res) => {
    const {elasticId,productId,userId,price,quantity,giftMsg} = req.body
    try {
        let sales,current_quantity,seller_sales,seller_id;
        const orderId = uuid()
        const d = Date(Date.now)
        const date = d.toString().split(' ')[0] + ' '+ d.toString().split(' ')[1]+ ' ' + d.toString().split(' ')[2] + ' '+ d.toString().split(' ')[3]
        console.log("----controller date----",date)
        console.log("Note:",giftMsg)
        const orderModel = {}
        orderModel['orderId'] = orderId
        orderModel['productId'] = productId
        orderModel['quantity'] = quantity
        orderModel['price'] = price
        orderModel['userId'] = userId
        orderModel['date'] = date
        orderModel['giftMsg']=giftMsg
        const product = await Product.findById(productId)
        if(product){
            const {productName, sellerId, img, category, description} = product;
            orderModel['productName'] = productName
            orderModel['productImg'] = img
            orderModel['category'] = category
            orderModel['description'] = description
            orderModel['giftMsg']=giftMsg
            sales=parseInt(product.sales);
            current_quantity=parseInt(product.quantity);
            const seller = await Seller.find({sellerId});
            if(seller.length>0){
                const {ownerId,name,ownerName,email,phNumber,img} = seller[0]
                orderModel['sellerId']=sellerId
                orderModel['ownerId']=ownerId
                orderModel['shopName']=name
                orderModel['ownerName']=ownerName
                orderModel['ownerEmail']=email
                orderModel['phNumber']=phNumber
                orderModel['shopImg']=img

                seller_sales=seller[0].sales;
                seller_id=seller[0]._id;

                const user = await User.findById(userId)
                if(user){
                    const {firstName,lastName,email} = user;
                    orderModel['firstName']=firstName
                    orderModel['lastName']=lastName
                    orderModel['userEmail']=email
                    const order = await Order.create(orderModel)
                    if(order){
                        const deleted_item_from_cart=await Cart.findOneAndDelete({userId})
                        if(deleted_item_from_cart){
                            const remain_quantity=String(current_quantity-parseInt(quantity));
                            const final_sales = String(sales+parseInt(quantity))
                            const final_product = await Product.findByIdAndUpdate(productId,{sales:final_sales,quantity:remain_quantity});
                            if(!final_product){
                                return res.status(201).json({message:'order placed, but failed to  update the product sales count'});
                            }
                            seller_sales+=parseInt(quantity);
                            const final_seller = await Seller.findByIdAndUpdate(seller_id,{sales:seller_sales});
                            if(!final_seller){
                                return res.status(201).json({message:'order placed, but failed to  update the shop sales count'});
                            }
                            return res.status(201).json({message:'Order placed successfully...'})
                        }
                        else{
                            return res.status(201).json({message:'order placed, but failed to remove from cart'})
                        }
                    }
                    else{
                        return res.status(201).json({message:'order didn"t placed....'})
                    }
                }
                else{
                    return res.status(404).json({message:'user didn"t found....'})   
                }
            }
            else{
                return res.status(404).json({message:'seller didn"t found....'}) 
            }
        }else{
            return res.status(404).json({message:'product didn"t found....'})
        }
        // OrderModel.placeOrder({productId,userId,price,quantity,date},(err,data)=>{
        //     if(err) return res.status(500).json({message:"Server error"+err})
        //     if(data){
        //         const orderModel = data
        //         CartModel.deleteByUserId({userId},(err,data)=>{
        //             if(err) return res.status(201).json({message:'Order placed, failed to remove items from cart'})
        //             if(data){
        //                 ProductModel.incrementSales({elasticId,productId,quantity},(err,data)=>{
        //                     if(err){
        //                         console.log(err)
        //                         return res.status(201).json({message:'Order placed, failed to update product sales'})
        //                     }
        //                     else{
        //                         SellerModel.incrementSales({sellerId:orderModel.sellerId,quantity},(err,data)=>{
        //                             if(err){
        //                                 return res.status(201).json({message:'Order placed, failed to update seller sales'})
        //                             }
        //                             else{
        //                                 //--SUCCESSFULL ORDER--
        //                                 console.log("---success order---")
        //                                 return res.json(data)
        //                             }
        //                         })
        //                     }
        //                 })
        //             }
        //         })
        //     }
        // })
    } catch (error) {
        return res.status(500).json({message:"Server error"+error})
    }
}