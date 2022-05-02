const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const config = require('../../config/constants')
const bcrypt = require('bcrypt')

exports.login = (req, res) => {
    const { email, password } = req.body
    try {
        UserModel.findByEmail({ email }, async (err, data) => {
            if (err) return res.status(500).json({ message: "Server error" })

            if (data.length === 0) {
                return res.status(400).json({ message: "Invalid Credentials" })
            }

            let user = data[0]
            const isMatch = await bcrypt.compare(password, user.password)

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
        })
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

exports.getUserDetails = (req,res) => {
    const id = req.user.id
    UserModel.findById({id},(err,data)=>{
        if(err) return res.status(500).json({message:"Server error"})
        if(data.length > 0){
            const user = data[0]
            return res.json(user)
        }
        return res.status(500).json({message:"No User found"})
    })
}