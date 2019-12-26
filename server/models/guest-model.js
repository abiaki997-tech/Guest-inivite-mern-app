const mongoose = require('mongoose')

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
  },
  dietary: {
    type: String,
    default: 'Non-Veg'
  },
  isconfirmed: {
    type: Boolean,
    default: false
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
 
},
{
  timestamps:true
})


const Guest= mongoose.model('Guest', guestSchema)

module.exports=Guest