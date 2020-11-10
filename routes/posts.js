const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify,  (res, req) => {
    res.json({
        posts: {
            title: "Try",
            description: "Body"
        }
    });
})


module.exports = router;