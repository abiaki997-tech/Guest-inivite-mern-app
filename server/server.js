const express = require('express')
const connectDB = require('./config/db')
const app = express()
require('./routes/guest-router')


connectDB()


app.use(express.json())


app.use('/register', require('./routes/user-router'))
app.use('/login',     require('./routes/login-router'))
app.use('/guests',    require('./routes/guest-router'))



const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server started at port ${PORT}`))


const Guest = require('./models/guest-model')
const User= require('./models/user-model')

const main =async() =>{
  // const guest= await Guest.findById('5dfb9ee68270541418a4f6e6')
  // await guest.populate('owner').execPopulate()
  // console.log(guest.owner)

  // const user= await User.findById('5dfb9ea58270541418a4f6e4')
  // await user.populate('guests').execPopulate()
  // console.log(user.guests)
}

// main()