const router = require('express').Router();
const verify = require('./verifyToken');
const Article = require('../model/Article');
const mongoose = require('mongoose');
const {articleCreateValidation} = require('./validation');
const User = require('../model/User');
const Profile = require('../model/Profile');
const Publication = require('../model/Publication');
const { boolean } = require('@hapi/joi');

router.post('/create', verify, async (req, res) => {
    let article  = {
        published: req.body.published,
        writerid: req.user._id,
        claps: req.body.claps,
        imageUrl: req.body.imageUrl,
        body: req.body.body,
        title: req.body.title,
        description: req.body.description,
        clapersIds: [],
        editorsids: [req.user._id],
        tagslist: req.body.taglist
        
    };
    const { error }= articleCreateValidation(article);
    if(error) 
    {
        out = {
            error: true,
            msg: error.details[0].message
        };
        return res.send(out);
    }
    article = new Article( article );
    try{
        const result = await article.save();
        res.send(result);
        console.log(result);
    }
    catch(err)
    {
        res.status(400).send(err);
    }
})

router.post('/publish', verify, async (req, res) => {
    const aid = mongoose.Types.ObjectId(req.body.articleid);
    if(!aid) {
        return res.json({
            "error": 30,
            "body": "Article ID is invalid or not existing"
        });
    }
    const article = await Article.findOne({_id: aid});
    console.log(article);
    if(!article) {
        return res.json({
            "error": 404,
            "body": "Not found"
        });
    }
    function checkEditor(x) {
        console.log(x);
        return x == req.user._id;
      }
    if(!await article.editorsids.find(checkEditor))
    {
        return res.json({
            "error": 404,
            "body": "Not found access"
        });
    }
    article.published = true;
    try{
        const article1 = await Article.update(
            {_id : aid},
            article
            );

            res.json({
                article
            });
    }
    catch(err)
    {
        res.status(400).send(err);
    }
})

router.get('/:id', async (req, res) => {
    const aid = mongoose.Types.ObjectId(req.params.id);
    const article = await Article.findById(aid);
    console.log("Article info",aid);
    console.log(article);
    if(article == null) {
        return res.json({
            "error": true,
            "body": "Not found"
        });
    }
    const user = await User.findById(mongoose.Types.ObjectId(article.writerid));
    const writer = {
    firstname: user.firstname,
    lastname: user.lastname,
    
    };
    const profile = await Profile.findOne({userid: mongoose.Types.ObjectId(article.writerid)});
    const prof = {
    image: profile.image,
    about: profile.about,
    };
    let publication = {};
    if(!article.pid)
    {
    	publication = {
    	exists: false
    	}
    }
    else
    {
    	const publication = await Publication.findById(mongoose.Types.ObjectId(article.pid));
    	publication = {
    	name: publication.displayname,
    	desc: publication.description,
    	pid: publication._id,
    	}
    }
    res.json({article, writer, prof, publication});
})


router.get('/list/:page', async (req, res) => {
    console.log("List the articles");
    const page_size = parseInt(process.env.PAGE_SIZE);
    const page = parseInt(req.params.page || "0");
    const total = await Article.countDocuments({});
    console.log(total);
    const articles = await Article.find({published: true},{published: 1,writerid: 1, imageUrl: 1, title: 1,description: 1,pid: 1, updatedAt: 1}).limit(page_size).skip(page_size * page);
    console.log(articles);
    return res.json({articles});
})


router.get('/user/:id', async (req, res) => {
    const articles = await Article.find({writerid: mongoose.Types.ObjectId(req.params.id)},{published: 1,writerid: 1, imageUrl: 1, title: 1,description: 1,pid: 1, updatedAt: 1, body: 1});
    return res.json({articles});
})

/*
router.post('/clap/:id', verify ,async (req, res) => {
    const article = await Article.find({_id: mongoose.Types.ObjectId(req.params.id)});
    if(article==null) 
    {
    	return res.json({
            "error": 404,
            "body": "Article not found"
        });
    }
    
    aritcle.clapersIds.
})*/

router.post('/modify/:id', verify, async (req, res) => {
    const aid =  mongoose.Types.ObjectId(req.params.id);
    const article = await Article.findOne({_id: aid});
    if(article == null || article.published === false) {
        return res.json({
            "error": 404,
            "body": "Not found 1"
        });
    }
    if(!await article.editorsids.find(
        (x) =>
        {
            return mongoose.Types.ObjectId(x).equals(mongoose.Types.ObjectId(req.user._id));
        }
    ))
    {
        return res.json({
            "error": 404,
            "body": "Not found 2"
        });
    }
    article.title = req.body.title;
    article.body = req.body.body;
    article.description = req.body.description;
    try{
        const article1 = await Article.update(
            {_id : mongoose.Types.ObjectId(aid)},
            article
            );

            res.json({
                article1
            });
    }
    catch(err)
    {
        res.status(400).send(err);
    }
})

router.get('/modify/:id', verify, async (req, res) => {
    const aid = mongoose.Types.ObjectId(req.params.id);
    const article = await Article.findOne({_id: aid});
    if(article == null || article.published == false) {
        return res.json({
            "error": 404,
            "body": "Not found"
        });
    }
    if(!await article.editorsids.find(
        (x) =>
        {
            return mongoose.Types.ObjectId(x).equals(mongoose.Types.ObjectId(req.user._id));
        }
    ))
    {
        return res.json({
            "error": 404,
            "body": "Not found 2"
        });
    }
    res.json(article);
})

router.post('/remove/:id', verify, async (req, res) => {
    const aid = mongoose.Types.ObjectId(req.params.id);
    const article = await Article.findOne({_id: aid});
    if(article == null || article.published == false) {
        return res.json({
            "error": 404,
            "body": "Not found"
        });
    }
    if(!await article.editorsids.find(
        (x) =>
        {
            return mongoose.Types.ObjectId(x).equals(mongoose.Types.ObjectId(req.user._id));
        }
    ))
    {
        return res.json({
            "error": 404,
            "body": "Not found 2"
        });
    }
    article.published = true;
    try{
        const article1 = await Article.remove(
            {_id : req.params._id}
            );
            res.json({
                article1
            });
    }
    catch(err)
    {
        res.status(400).send(err);
    }
})

module.exports = router;
