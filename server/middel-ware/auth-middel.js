require('dotenv').config()
const jwt=require('jsonwebtoken')//for verify
const User=require('../models/user-model')//for look array of token



const auth= async (req,res,next)=>{
  
  try{
    const token = req.header('x-auth-token')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const id=(decoded)
    
    const user = await User.findById(id)
    
    if (!user) {
        throw new Error()
    }


    req.token=token //send token to req.token
    req.user=user  // send user for route handlers
    next()
  }
  catch(err){
    console.error(err.message)
    res.status(401).send(err)
  }
  
  
}

module.exports=auth