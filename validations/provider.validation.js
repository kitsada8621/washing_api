const Joi = require('joi');

exports.showAll = async (data) => {
    try {
        let schema = await Joi.object({
            search: Joi.string().required().allow('', null),
            limit: Joi.number().min(0).max(9999999999).required(),
            skip: Joi.number().min(0).max(9999999999).required(),
        });

        let error = await schema.validate(data);
        return error;
    } catch (e) {
        console.log('err validate show device: ', e);
        return null;
    }
}

exports.details = async (data) => {
    try {

        let schema = await Joi.object({
            id: Joi.number().min(1).max(9999999999).required()
        });

        let error = await schema.validate(data);
        return error;
    } catch (e) {
        console.log('err: ', e);
        return null;
    }
}