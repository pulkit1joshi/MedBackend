const router = require('express').Router();
const verify = require('./verifyToken');
const Article = require('../model/Article');
const mongoose = require('mongoose');
const {articleCreateValidation} = require('./validation');

router.post('/create', verify, async (req, res) => {
    let article  = {
        published: false,
        writerid: req.user._id,
        claps: 0,
        imageUrl: "try",
        body: req.body.body,
        title: req.body.title,
        description: req.body.description,
        clapersIds: [],
        editorsids: [req.user._id],
        tagslist: []
        
    };
    console.log(article);
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
    const article = await Article.findOne({_id: aid});
    console.log(article);
    if(article == null || article.published == false) {
        return res.json({
            "error": 404,
            "body": "Not found"
        });
    }
    res.json(article);
})

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