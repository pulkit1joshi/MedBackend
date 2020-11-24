const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object({
        firstname: Joi.string().min(3).required(),
        username: Joi.string().min(6).required(),
        lastname: Joi.string().min(3),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data);
};

const profileUpdateValidation = data => {
    const schema = Joi.object({
        userid: Joi.required(),
        about: Joi.string().min(8).required(),
        image: Joi.string().min(8).required(),
        gender: Joi.required(),
        country: Joi.required(),
        interests: Joi.required()
    });
    return schema.validate(data);
};

const articleCreateValidation = data => {
    const schema = Joi.object({
        published: Joi.boolean().required(),
        writerid: Joi.required(),
        claps: Joi.required(),
        clapersIds: Joi.required(),
        editorsids: Joi.required(),
        pid: Joi.any(),
        tagslist: Joi.array(),
        imageUrl: Joi.required(),
        body: Joi.string().min(100).required(),
        title: Joi.string().min(10).required(),
        description: Joi.string().min(10).required()
    });
    return schema.validate(data);
};

const publicationCreateValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(10).required(),
        displayname: Joi.string().min(10).required(),
        ownerid: Joi.required(),
        followerscount: Joi.required(),
        writersids: Joi.array(),
        editorsids: Joi.array(),
        description: Joi.string().min(10).required(),
        postids: Joi.array(),
        draftids: Joi.array(),
        image: Joi.string().min(10).required(),
        theme: Joi.number(),
        pages: Joi.number(),
        pinnedPostids: Joi.array(),
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.articleCreateValidation = articleCreateValidation;
module.exports.publicationCreateValidation = publicationCreateValidation;
module.exports.loginValidation = loginValidation;
module.exports.profileUpdateValidation =  profileUpdateValidation;