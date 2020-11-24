const router = require('express').Router();
const verify = require('./verifyToken');
const Publication = require('../model/Publication');
const Article = require('../model/Article');
const User = require('../model/User');
const mongoose = require('mongoose');
const {publicationCreateValidation} = require('./validation');
const Profile = require('../model/Profile');

router.post('/create', verify, async (req, res) => {
    let publication  = {
        name: req.body.name,
        displayname: req.body.displayname,
        ownerid: req.user._id,
        followerscount: 0,
        writersids: [],
        editorsids: [req.user._id],
        description: req.body.description,
        postids: [],
        draftids: [],
        image: req.body.image,
        theme: 1,
        pages: 0,
        pinnedPostids: []
        
    };
    const { error }= publicationCreateValidation(publication);
    if(error) return res.status(400).send(error.details);
    let publication2 = await Publication.findOne({name: req.body.name});
    if(publication2) 
    {
        return res.json({
            error: 40,
            message: "Publication with this name exists."
        })
    }
    publication2 = await Publication.findOne({displayname: req.body.displayname});
    if(publication2) 
    {
        return res.json({
            error: 40,
            message: "Publication with this display name exists."
        })
    }


    publication = new Publication( publication );
    console.log(publication);
    try{
        const result = await publication.save();
        res.send(publication);
    }
    catch(err)
    {
        res.status(400).send(err);
    }
})

router.get('/:id', async (req, res) => {
    const pname = String(req.params.id);
    const publication = await Publication.findOne({name: pname});
    console.log(publication);
    if(publication == null) {
        return res.json({
            "error": 404,
            "body": "Not found"
        });
    }
    res.json(publication);
})

router.post('/:id/addwriter', verify, async (req, res) => {
    const editorCheck = await isEditor(req.user._id, req.params.id);
    
    if(!editorCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not editor"
        });
    }
    const publication = await Publication.findOne({_id: mongoose.Types.ObjectId(req.params.id)});
    //console.log(publication);

    const user = await User.findOne({username: req.body.username});
    //console.log(user);
    if(user == null)
    {
        return res.json({
            "error": 404,
            "body": "User Not Found"
        });
    }
    console.log(user._id);
    const profile = await Profile.findOne({userid: mongoose.Types.ObjectId(user._id)});
    if(profile == null)
    {
        return res.json({
            "error": 404,
            "body": "Profile Not Found"
        });
    }
    //console.log(profile);
    console.log(publication.writersids);
    console.log(iswriter(user._id, publication.writersids));
    if(await iswriter(user._id, publication.writersids) == true)
    {
        return res.json({
            "error": 500,
            "body": "Already a writer"
        });
    }
    
    try {
        
        profile.publicationids.push(req.params.id);
        const prof = await Profile.update(
            {userid : user._id},
            profile
            );
        publication.writersids.push(user._id);
        const pub = await Publication.update(
            {_id : req.params.id},
            publication
            );

            res.json(
                pub
            );
    }
    catch(err)
    {
        return res.send(err);
        return res.json({
            "Problem": true,
            "info": err
        })
    }
})

router.get('/:id/drafts', verify, async (req, res) => {
    const editorCheck = await isEditor(req.user._id, req.params.id);
    
    if(!editorCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not editor"
        });
    }
    const publication = await Publication.findOne({_id: req.params.id});
    let draftids = publication.draftids;
    const drafts = await Article.find().where('_id').in(draftids).exec();
    return res.json(drafts);
})




async function isEditor(uid, pid)
{
    const publication = await Publication.findOne({_id: mongoose.Types.ObjectId(pid)});
    if(publication == null) return false;
    return publication.editorsids.find(
        (x) =>
        {

            return mongoose.Types.ObjectId(x).equals(mongoose.Types.ObjectId(uid));
        }
    )
}

async function iswriter(uid, wids)
{

    const a = wids.find(
        (x) =>
        {
            return mongoose.Types.ObjectId(x).equals(mongoose.Types.ObjectId(uid));
        }
    )
    if(a) return true;
    return false;
}

module.exports = router;