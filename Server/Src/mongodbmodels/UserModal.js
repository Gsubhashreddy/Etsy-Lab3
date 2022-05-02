const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:{
        type:String,
        unique:true
    },
    contactNumber:{
        type:String
    },
    password:String,
    gender:String,
    dob:Date,
    city:String,
    address:String,
    zipcode:String,
    about:String,
    country:String,
    profileImg:String
});

const User = mongoose.model('user',userSchema);

module.exports = User;