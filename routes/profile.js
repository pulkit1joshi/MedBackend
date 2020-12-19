
const router = require('express').Router();
const verify = require('./verifyToken');
const Profile = require('../model/Profile');
const User = require('../model/User');
const {profileUpdateValidation} = require('./validation');
const bcrypt = require('bcryptjs');

router.get('/profile', verify, async (req, res) => {
    const user = await Profile.findOne({userid: req.user._id});
    const user2 = await User.findOne({_id: req.user._id});
    console.log(user);
    res.json({
        user,
        user2
    });
})

router.get('/find/user/:username', verify, async (req, res) => {

    const user = await User.findOne({username: req.params.username});
    console.log(user);
    if(user)
    {
    return res.json({
        exists: true,
    });
    }
    else
    {
        return res.json({
            exists: false,
        });
    }
})

router.get('/find/email/:email', verify, async (req, res) => {
    const user = await User.findOne({email: req.params.email});
    console.log(user);
    if(user)
    {
    return res.json({
        exists: true,
    });
    }
    else
    {
        return res.json({
            exists: false,
        });
    }
})


router.post('/profile', verify, async (req, res) => {
    
    const user = await Profile.findOne({userid: req.user._id});
    const user2 = await User.findOne({_id: req.user._id});
    if(!user) return res.send(404);

    const error = profileUpdateValidation(req.body);
    if(error) 
    {
        out = {
            error: true,
            msg: error.details[0].message
        };
        return res.send(out);
    }

    try{
        const prof = await Profile.update(
            {userid : req.user._id},
            {
                "userid": req.user._id,
                "about": req.body.about,
                "image": req.body.image,
                "gender": req.body.gender,
                "country": req.body.country,
                "interests": req.body.interests
            }
            );
            const validPass = await bcrypt.compare(req.body.password, user.password)
        if(req.body.password == user2.password || validpass)
        {
         await User.update(
                {__id : req.user._id},
                {
                    "email": req.body.email,
                    "username": req.body.username,
                    "firstname": req.body.firstname,
                    "lastname": req.body.lastname,
                }
                );
        }
        else
        {
        const salt = await bcrypt.genSalt(10);
    	const hashPassword =  await bcrypt.hash(req.body.password, salt);
        await User.update(
                {__id : req.user._id},
                {
                    "email": req.body.email,
                    "password": hashpassword,
                    "username": req.body.username,
                    "firstname": req.body.firstname,
                    "lastname": req.body.lastname,
                }
                );
        }
        res.json(
                prof
            );
    }
    catch(err)
    {
        res.statusMessage = error;
        return res.status(404).end();
    }
    
})

module.exports = router;
