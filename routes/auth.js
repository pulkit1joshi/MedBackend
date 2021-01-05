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
    console.log(error);
    if(error) 
    {
        out = {
            error: true,
            msg: error.details[0].message
        };
        return res.send(out);
    }
    // Check already exist
    const emailExist = await User.findOne({email: req.body.email});
    const userExist = await User.findOne({username: req.body.username});
    if(emailExist) 
    {
        out = {
            error: true,
            msg: "Email already exists. Please login."
        };
        return res.send(out);
    }
    if(userExist) {
        out = {
            error: true,
            msg: "Username already exists. Please login."
        };
        return res.send(out);
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword =  await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        admin: false,
    });
    
    try{
        const savedUser = await user.save();
        const profile = new Profile({
            userid: savedUser._id,
            image: "https://d11a6trkgmumsb.cloudfront.net/original/3X/d/8/d8b5d0a738295345ebd8934b859fa1fca1c8c6ad.jpeg"
        });
        const savedProfile = await profile.save();
        console.log(savedProfile);
        {
            out = {
                error: false,
                data: savedUser
            };

        }
        res.send(out);
        
    }
    catch(err)
    {
            out = {
                error: true,
                msg: err
            };
            return res.send(out);
    }
});

/*

*/

router.post('/login',async (req, res) =>
{
    const { error } = loginValidation(req.body);
    if(error) 
    {
        out = {
            error: true,
            msg: error.details[0].message
        }
        return res.send(out);
    }
    console.log(req.body);
    const user = await User.findOne({email: req.body.email});
    if(!user) 
    {
        out = {
            error: true,
            msg: "Email doesn't exist"
        };
        return res.send(out);
    }

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) 
        {
            out = {
                error: true,
                msg: "Wrong password"
            };
            return res.send(out);
        }
    // Set Logged in Token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

    out = {
        error: false,
        msg: {
            token: token,
        },
    };
    res.header('auth-token', token).send(out);
});

module.exports = router;
