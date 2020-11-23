const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User');

router.post('/add', verify, async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not admin"
        });
    }
    res.json({ "test": "done"});
})

router.post('/delete', verify, async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not admin"
        });
    }
    res.json({ "test": "done"});
})

router.get('/list', verify, async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not admin"
        });
    }
    res.json({ "test": "done"});
})

router.get('/publication/list', verify, async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not admin"
        });
    }
    res.json({ "test": "done"});
})

router.post('/publication/remove', verify, async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not admin"
        });
    }
    res.json({ "test": "done"});
})


router.post('/article/list', verify, async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not admin"
        });
    }
    res.json({ "test": "done"});
})

router.post('/article/remove', verify, async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not admin"
        });
    }
    res.json({ "test": "done"});
})

async function isAdmin(id)
{
    const user = await User.findOne({_id: id});
    console.log(user.admin);
    return user.admin;
}

module.exports = router;