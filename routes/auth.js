const router = require('express').Router();
const User = require('../model/User');
const Profile = require('../model/Profile');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('./validation');
const jwt = require('jsonwebtoken');


/*
{
    "firstname": "name",
    "lastname": "secname",
    "username": "abcd",
    "email": "email@gmail.com",
    "password": "pass"
}
*/

router.post('/register', async (req, res) =>
{
    const { error }= registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // Check already exist
    const emailExist = await User.findOne({email: req.body.email});
    const userExist = await User.findOne({username: req.body.username});
    if(emailExist) return res.status(400).send("Email Exists")
    if(userExist) return res.status(400).send("Username Exists")
    const salt = await bcrypt.genSalt(10);
    const hashPassword =  await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        admin: true
    });
    
    try{
        const savedUser = await user.save();
        const profile = new Profile({
            userid: savedUser._id,
        });
        const savedProfile = await profile.save();
        console.log(savedProfile);
        res.send(savedUser);
        
    }
    catch(err)
    {
        res.status(400).send(err);
    }
});

/*

*/

router.post('/login',async (req, res) =>
{
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email: req.body.email});
    if(!user) res.status(400).send("Email does not exist");

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Wrong password');
    // Set Logged in Token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;