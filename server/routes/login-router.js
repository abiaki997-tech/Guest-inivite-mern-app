require('dotenv').config()
const express =require('express')
const router= new express.Router()
const User = require('../models/user-model')
const auth=require('../middel-ware/auth-middel')


router.post('/',async(req,res)=>{
    try{
      console.log(req.body.email)
      const user=await User.findByCredtinals(req.body.email,req.body.password)
      //token return (specific user above)
      const token=await user.generateAuthToken()
  
      res.send({user,token})//return properties
    }
    catch(e){
      console.error(e.message)
     res.status(400).json({msg:'Unable to login'})

    }
  })

 router.get('/', auth, async (req, res) => {
   try {
      res.json(req.user)
    } catch (err) {
      console.error(err.message)
      res.status(401).json({error:[{msg:'Pls Auth'}]})
     }
    })

router.delete('/delete',auth,async(req,res)=>{
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (error) {
    res.status(500).json({error:[{msg:'Pls Auth'}]})
  }
})    
    

module.exports=router;