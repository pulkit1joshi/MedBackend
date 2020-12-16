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
    if(error) 
    {
        res.statusMessage = error;
        return res.status(404).end();
    }
    // Check already exist
    const emailExist = await User.findOne({email: req.body.email});
    const userExist = await User.findOne({username: req.body.username});
    if(emailExist) return res.status(404).send("Email Exists")
    if(userExist) return res.status(404).send("Username Exists")
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
        res.status(404).send(err);
    }
});

/*

*/

router.post('/login',async (req, res) =>
{
    const { error } = loginValidation(req.body);
    if(error) 
    {
        res.statusMessage = error;
        return res.status(404).end();
    }
    const user = await User.findOne({email: req.body.email});
    if(!user) 
    {
        res.statusMessage = "Email does not exist";
        return res.status(404).end();
    }

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) 
        {
            res.statusMessage = "Wrong password";
            return res.status(404).end();
        }
    // Set Logged in Token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;