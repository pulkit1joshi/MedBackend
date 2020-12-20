
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
	
    const { error } = profileUpdateValidation(req.body);
    if(error) 
    {
    let out ={};

        out = {
            error: true,
            msg: error
        };
        return res.send(out);
    }
	
    try{
    
        const prof = await Profile.updateOne(
            {userid : req.user._id},
            {
                "about": req.body.about,
                "image": req.body.image,
                "gender": req.body.gender,
                "country": req.body.country,
                "interests": req.body.interests
            }
            );
            console.log(req.user._id);
            const validPass = await bcrypt.compare(req.body.password, user2.password);
        if(req.body.password == user2.password || validPass)
        {
        //console.log(user2);
         const out = await User.updateOne(
                {_id : req.user._id},
                {
                    "email": req.body.email,
                    "username": req.body.username,
                    "firstname": req.body.firstname,
                    "lastname": req.body.lastname,
                }
                );
                //console.log(out);
        }
        else
        {
        const salt = await bcrypt.genSalt(10);
    	const hashPassword =  await bcrypt.hash(req.body.password, salt);
    	//console.log("YOOYY");
    	//console.log(req.body);
        const out = await User.updateOne(
                {_id : req.user._id},
                {
                    "email": req.body.email,
                    "password": hashPassword,
                    "username": req.body.username,
                    "firstname": req.body.firstname,
                    "lastname": req.body.lastname,
                }
                );
                //console.log(out);
        }
        res.json(
                prof
            );
    }
    catch(err)
    {
    
        res.statusMessage = err;
        return res.send(err);
    }
    
})

module.exports = router;
