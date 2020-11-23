
const router = require('express').Router();
const verify = require('./verifyToken');
const Profile = require('../model/Profile');
const {profileUpdateValidation} = require('./validation');

router.get('/profile', verify, async (req, res) => {
    const user = await Profile.findOne({userid: req.user._id});
    console.log(user);
    res.json({
        user
    });
})



router.post('/profile', verify, async (req, res) => {
    
    const user = await Profile.findOne({userid: req.user._id});
    if(!user) return res.send(404);

    const error = profileUpdateValidation(req.body);
    if(error) return res.status(400).send(error);

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

            res.json({
                prof
            });
    }
    catch(err)
    {
        res.status(400).send(err);
    }
    
})

module.exports = router;