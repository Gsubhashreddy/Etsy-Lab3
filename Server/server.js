const express = require('express')
const app = express()
const fileUpload = require('express-fileupload');
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

app.use(cors())
app.use(fileUpload())
app.use(express.static('./public'));

//Init Middleware
app.use(express.json({extended:false}))

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
exports.upload = multer({
    storage: storage
});

app.use('/api/users',require('./src/routes/user.routes'))
app.use('/api/shop',require('./src/routes/seller.routes'))
app.use('/api/dashboard',require('./src/routes/dashboard.routes'))
app.use('/api/order',require('./src/routes/order.routes'))
app.use('/api/products',require('./src/routes/products.routes'))

app.use(express.static(__dirname + '/public'));
app.get('*', function (req, res) {
    res.sendFile(`${__dirname}/public/index.html`, (err) => {
      if (err) {
        //console.log(err);
        res.end(err.message);
      }
    });
  });

const PORT = 8585

mongoose.connect(`mongodb+srv://subbu:GETdata7@etsy.9oaup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
  useNewUrlParser: true
}).then(con=>{
    console.log('database connected succesfully...')
  }).catch(err =>{
    console.log(err.message,'line 52')
  })
app.listen(PORT,(req,res)=>{
    console.log("Server running on port 8585")
})

module.exports = app