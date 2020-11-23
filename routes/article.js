const router = require('express').Router();
const verify = require('./Verification/verifyUser');
const Article = require('../model/Article');

router.post('/article/publish', verify, async (req, res) => {
    
})

router.get('/article/:id', verify, async (req, res) => {
    
})

router.post('/article/modify/:id', verify, async (req, res) => {
    
})

router.get('/article/modify/:id', verify, async (req, res) => {
    
})

router.post('/article/remove/:id', verify, async (req, res) => {
    
})

module.exports = router;