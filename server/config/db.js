require('dotenv').config()

const mongoose =require('mongoose')
const url = process.env.URL

const connectDB= async()=>{
  try {
    await mongoose.connect(url,{useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true})
    console.log('Connect mongodb')
  }
  catch (error) {
    console.log(err.message)
    process.exit(1)
  }
}

module.exports=connectDB