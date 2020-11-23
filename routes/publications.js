const router = require('express').Router();
const verify = require('./Verification/verifyPublication');
const Publication = require('../model/Publication');

router.post('/publication/add', verify, async (req, res) => {
    const editorCheck = await isEditor(req.user._id, req.body.publicationid);
    if(!editorCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not editor"
        });
    }
    res.json({ "test": "done"});
    
})

router.get('/publication/:id', verify, async (req, res) => {
    
    
})

router.post('/publication/:id/addwriter', verify, async (req, res) => {
    const editorCheck = await isEditor(req.user._id, req.body.publicationid);
    if(!editorCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not editor"
        });
    }
    res.json({ "test": "done"});
})

router.get('/publication/:id/drafts', verify, async (req, res) => {
    const editorCheck = await isEditor(req.user._id, req.body.publicationid);
    if(!editorCheck) 
    {
        
        return res.json({
            "error": 500,
            "body": "Not editor"
        });
    }
    res.json({ "test": "done"});
})

async function isEditor(uid, pid)
{
    const publication = await Publication.findOne({_id: pid});
    return publication.editorsid.find(pid);
}

module.exports = router;