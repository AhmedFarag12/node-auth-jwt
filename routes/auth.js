const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation , loginValidation } = require('../validation')


//Register
router.post('/register', async (req, res) => {

    //validate data before make a user
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    //check the user if he is in database
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send('Email already exists!')

    //hash the password
    const salt = await bcrypt.genSalt(10) 
    const hashedPassword = await bcrypt.hash(req.body.password , salt)


    //create a new user
    const user = new User({
        name: req.body.name, 
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save()
        res.send({user : user._id})
    } catch (error) {
        res.status(400).send(error)
    }

});

//Login
router.post('/login' , async (req,res)=>{

    //validate data before make a user
     const { error } = loginValidation(req.body)
     if (error) return res.status(400).send(error.details[0].message);

    //check the email exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email is not found!')

    //password is correct
    const validPass = await bcrypt.compare(req.body.password , user.password)
    if(!validPass) return res.status(400).send('Invalid Password!')

    //create and assign token 
    const token = jwt.sign({_id : user._id} , process.env.TOKEN_SECRET)
    res.header('auth-token' , token).send(token)

    // res.send('Logged in!')


})



module.exports = router;