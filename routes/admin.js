const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User');
const Publication = require('../model/Publication');
const Article = require('../model/Article');

router.get('/users',verify ,async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not admin"
        });
    }
    User.find({}, (err, result) => {
        if(err)
        {
            res.send(err);
        }
        else{
            res.json(result);
        }
    })
})

router.get('/admins', async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not admin"
        });
    }
    User.find({admin: true}, (err, result) => {
        if(err)
        {
            res.send(err);
        }
        else{
            res.json(result);
        }
    })
})

router.post('/add', verify, async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not admin"
        });
    }
    try{
        const addAdmin = await User.update({username: req.body.username}, { admin: true });
        res.send(addAdmin);
    }
    catch(err)
    {
        res.status(400).send(err);
    }
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
    try{
        const addAdmin = await User.update({username: req.body.username}, { admin: false });
        res.send(addAdmin);
    }
    catch(err)
    {
        res.status(400).send(err);
    }
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
    User.find({admin: true}, (err, result) => {
        if(err)
        {
            res.send(err);
        }
        else{
            res.json(result);
        }
    })
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
    Publication.find({} , (err, result) =>
    {
        if(err)
        {
            res.send(err)
        }
        else
        {
            res.json(result);
        }
    })
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
    const publication = await Publication.find({_id: req.body._id});
    if(!publication) return res.status(404).json(
        {
            "error": 404,
            "message": "Publication not found"
        }
    )
    try {
        const result = Publication.remove({_id: req.body._id});
        const updateA = Article.update({pid: req.body._id});
        res.json({
            publicationupdate: {result},
            articlesupdate: {updateA}
        });
    }
    catch(err)
    {
        res.json({
            "error": 1,
            "body": err
        });
    }
})


router.get('/article/list', verify, async (req, res) => {
    const adminCheck = await isAdmin(req.user._id);
    if(!adminCheck) 
    {
        
        return res.json({
            "error": 403,
            "body": "Not admin"
        });
    }
    Article.find({} , (err, result) =>
    {
        if(err)
        {
            res.send(err)
        }
        else
        {
            res.json(result);
        }
    })
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
    const article = await Article.find({_id: req.body._id});
    const pid = article.pid;
    if(!article) return res.status(404).json(
        {
            "error": 404,
            "message": "Article not found"
        }
    )
    try {
        const result = Article.remove({_id: req.body._id});
        res.json({
            articleupdate: {result}
        });
    }
    catch(err)
    {
        res.json({
            "error": 1,
            "body": err
        });
    }
})

async function isAdmin(id)
{
    const user = await User.findOne({_id: id});
    console.log(user.admin);
    return user.admin;
}

module.exports = router;