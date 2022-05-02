const User = require('../mongodbmodels/UserModal');
const jwt = require('jsonwebtoken')
const config = require('../../config/constants')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
        const data = await User.find({email})
        if(!data){
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const user = data[0];
        const isMatch = await bcrypt.compare(password, user.password)
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' })
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.jwtSecret,
            {
                expiresIn: 3600
            },
            (err, token) => {
                if (err) throw err
                return res.json({ token })
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"+error.message})
    }
}

exports.getUserDetails = async (req,res) => {
    const id = req.user.id
    const user = await User.findById(id);
    console.log(user);
    if(!user)return res.status(500).json({message:"Server error"})
    if(user){
        return res.json(user)
    }
    return res.status(500).json({message:"No User found"})
    // UserModel.findById({id},(err,data)=>{
    //     if(err) return res.status(500).json({message:"Server error"})
    //     if(data.length > 0){
    //         const user = data[0]
    //         return res.json(user)
    //     }
    //     return res.status(500).json({message:"No User found"})
    // })
}