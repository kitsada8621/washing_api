const Joi = require('joi');

exports.loginValidate = async (data) => {
    try {
        let schema = await Joi.object({
            username: Joi.string().max(255).required(),
            password: Joi.string().max(255).required()
        });

        let error = await schema.validate(data);
        return error;
    } catch (e) {
        return null;
    }
}