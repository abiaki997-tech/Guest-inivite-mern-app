require('dotenv').config()
const express =require('express')
const router= new express.Router()
const User = require('../models/user-model')
const { check, validationResult } = require('express-validator')




router.post('/',
  [
    check('name', 'Please provide a name').not().isEmpty(),
    check('email', 'Please provide an email').isEmail(),
    check('password', 'Password at least 6 character long').isLength({ min: 6 })

  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }

      // if no, create the user in the db
     
    const { name, email, password } = req.body

    try {
      // user already exits ?
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ error: [{ msg: 'user already exits' }] })
      }
      user = new User({
        name,
        email,
        password,
      })

      // password encryption
      //generate token
      await user.save()
      const token= await user.generateAuthToken()
      res.status(201).send({user,token})
     
    } catch (err) {
      console.error(err.message)
      res.status(500).send('server error')
    }
  })

  
  module.exports=router