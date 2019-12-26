const mongoose = require('mongoose')
require('dotenv').config()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Guest=require('./guest-model')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  tokens:[{
    token:{
      type:String,
      required:true
    } 
  }]
})
userSchema.virtual('guests',{
  ref:'Guest',
  localField:'_id',
  foreignField:'owner'

})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
 
  const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  
  await user.save()

  return token
}


// // Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this
  
  if(user.isModified('password')){ //password hashed once
    user.password= await bcrypt.hash(user.password,8)
  }
  next()
})

userSchema.pre('remove',async function (next){
  const user= this
  await Guest.deleteMany({owner:user._id})
  next()
})

userSchema.statics.findByCredtinals=async(email,password)=>{
  //find user
  const user = await User.findOne({email})
  if(!user){
    throw new Error()
  }
  
  const passwordcheck = await bcrypt.compare(password,user.password)

  if(!passwordcheck){
    throw new Error()
  }
console.log(passwordcheck)
  return user
}



const User= mongoose.model('User', userSchema)

module.exports=User

