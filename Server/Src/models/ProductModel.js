var db = require('../../config/db')
const uuid = require('uuid').v4
const elasticClient = require('./../../config/ElasticClient')

exports.createProduct = ({ sellerId, name, category, description, price, quantity, img }, result) => {
    const id = uuid()
    // elasticClient.index({
    //     index: 'products',
    //     body: { id, sellerId, name, category, description, price, quantity, img }
    // }).then(resp => {
    //     const elasticId = resp._id
        const sql = `insert into products(product_id,seller_id,product_name,category,description,price,quantity,img,sales)
        values('${id}','${sellerId}','${name}','${category}','${description}','${price}','${quantity}','${img}',0)`
        db.query(sql, (err, res) => {
            if (err) {
                result(err, null)
            }
            else {
                result(null, res)
            }
        // })
    })

}

exports.editProduct = ({  productId, name, category, description, price, quantity, img }, result) => {
    console.log("------edit product-----")
        const sql = `update products set product_name = '${name}', category='${category}', description = "${description}",
        price='${price}', quantity='${quantity}', img='${img}' where product_id = '${productId}'`
        db.query(sql, (err, res) => {
            console.log("--------------------", err)
            if (err) {
                result(err, null)
            }
            else {
                result(null, res)
            }
        })
    

}

exports.getAll = ({ }, result) => {
    const sql = 'select * from products'
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

exports.searchProduct = ({searchParameter }, result) => {
    const sql = `select * from products where product_name LIKE '%${searchParameter}%'`
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null)
        } else {
            result(null, res)
        }
    })
}
exports.findByProductId = ({ productId }, result) => {
    const sql = `select * from products where product_id = '${productId}'`
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

exports.getProducts = ({ sellerId }, result) => {
    const sql = `select * from products where seller_id = '${sellerId}'`
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

exports.getProductsByCategory = ({ category }, result) => {
    const sql = `select * from products where category = '${category}'`
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

exports.getProductsByFilter = ({ category, price }, result) => {
    var sql = ``
    if (category) {
        sql = `select * from products where category = '${category}' and cast(price as float) <= '${price}'`
    } else {
        sql = `select * from products where  cast(price as float) <= '${price}'`
    }
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

exports.productsSortByPrice = ({ category, price, order }, result) => {
    var sql = ``
    if (category) {
        sql = `select * from products where category = '${category}' and cast(price as float) <= '${price}' order by cast(price as float) ${order}`
    } else {
        sql = `select * from products where cast(price as float) <= '${price}' order by cast(price as float) ${order}`
    }
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

exports.productsSortByQuantity = ({ category, price, order }, result) => {
    var sql = ``
    if (category) {
        sql = `select * from products where category = '${category}'  and cast(price as float) <= '${price}' order by cast(quantity as float) ${order}`
    } else {
        sql = `select * from products where  cast(price as float) <= '${price}' order by cast(quantity as float) ${order}`
    }
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

exports.productsSortBySales = ({ category, price, order }, result) => {
    var sql = ``
    if (category) {
        sql = `select * from products where category = '${category}'  and cast(price as float) <= '${price}' order by cast(sales as float) ${order}`
    } else {
        sql = `select * from products where  cast(price as float) <= '${price}' order by cast(sales as float) ${order}`
    }
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null)
        } else {
            result(null, res)
        }
    })
}

exports.incrementSales = ({ productId, quantity }, result) => {
    const salessql = `select sales from products where product_id = '${productId}'`
    const quantitysql = `select quantity from products where product_id = '${productId}'`

    db.query(salessql, (err, res) => {
        if (err) {
            return result(err, null)
        }
        const { sales } = res[0]
        db.query(quantitysql, (err, res) => {
            console.log(err)
            if (err)
                return result(err, null)

            const current_quantity = res[0].quantity

            console.log("----------------elastic id :------------")
           
                const sql = `update products set sales = '${sales + parseInt(quantity)}', quantity = '${current_quantity - parseInt(quantity)}' where product_id = '${productId}'`
                db.query(sql, (err, res) => {
                    console.log(err)
                    if (err) {
                        result(err, null)
                    }
                    else {
                        result(null, res)
                    }
                })
            })
       
        })

   
}

