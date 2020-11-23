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
        userid: Joi.required,
        about: Joi.string().min(8).required(),
        image: Joi.string().min(8).required(),
        gender: Joi.required(),
        country: Joi.required(),
        interests: Joi.required()
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.profileUpdateValidation =  profileUpdateValidation;