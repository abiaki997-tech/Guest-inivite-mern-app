const express =require('express')
const router= new express.Router()
const Guest = require('../models/guest-model')
const auth = require('../middel-ware/auth-middel')
const {check,validationResult}=require('express-validator')

 //post
router.post('/',auth,
    [
      check('name', 'Please provide the name').not().isEmpty(),
      check('phone', 'Please provide the phone number').not().isEmpty()
    ]
  
  ,async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // const { name, phone, diet, isconfirmed } = req.body

    try {
      const newGuest = new Guest({
        
        ...req.body,
        owner:req.user._id
      })
      const guest = await newGuest.save()

      res.json(guest)

    } catch (err) {

      console.error(err.message)
      res.status(500).send('server error')
    }
  })


router.get('/', auth, async (req, res) => {
  try {
  
    await req.user.populate('guests').execPopulate()
    res.send(req.user.guests) 
  } catch (err) {
    console.err(err.message)
    res.status(500).send('Server Error')
  }
})
 
router.get('/:id', auth, async (req, res) => {
        const _id = req.params.id
    
        try {
            const guest = await Guest.findOne({ _id, owner:req.user._id})
           
            if (!guest) {
                return res.status(404).send()
            }
            
            res.send(guest)
            
        } catch (e) {
            res.status(500).send(e)
        }
    })
    
router.patch('/:id', auth, async (req, res) => {
  const _id = req.params.id
 
   const updates = Object.keys(req.body)

   const allowedUpdates = ['dietary', 'isconfirmed']
   const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
 
        if (!isValidOperation) {
            return res.status(400).json( {msg :'Invalid updates!'} )
        }
    
        try {
            const guest = await Guest.findOne({_id:req.params.id, owner:req.user._id})
            
            if (!guest) {
                return res.status(404).json({msg:'Not authorised'})
            }
    
            updates.forEach((update) => guest[update] = req.body[update])
            await guest.save()
            res.send(guest)
        } catch (e) {
            res.status(404).send('Server Error')
        }
    })
    
router.delete('/:id', auth, async (req, res) => {
      try {
            const guest = await Guest.findOneAndDelete({_id:req.params.id,owner:req.user._id})
            
            if (!guest) {
                res.status(404).json({ msg: 'Guest not found' })
            }
            res.send(guest)
        } catch (e) {
            res.status(500).send('server error')
        }
    })
    

module.exports=router