const router = require('express').Router();
const verify = require('./verifyToken');
const Article = require('../model/Article');

router.post('/article/add', verify, async (req, res) => {
    
})


module.exports = router;