const Joi = require('joi');

exports.showAll = async (data) => {
    try {
        const error = await Joi.object({
            limit: Joi.number().min(0).max(9999999999).required(),
            skip: Joi.number().min(0).max(9999999999).required(),
            search: Joi.string().max(255).required().allow('', null),
        }).validate(data);

        return error;
    } catch (e) {
        console.log('err ', e);
        return null;
    }
}

exports.details = async (data) => {
    try {
        const error = await Joi.object({
            id: Joi.number().min(1).max(9999999999).required(),
        }).validate(data);

        return error;
    } catch (e) {
        console.log(e);
        return null;
    }
}

exports.create = async (data) => {
    try {
        console.log('data: ', data);
        const error = await Joi.object({
            name: Joi.string().max(255).required(),
            serviceRate: Joi.number().min(0).max(9999999999).required().allow(0),
            desc: Joi.string().max(1024).required().allow('', null),
            image: Joi.object().allow('', null),
        }).validate(data);

        return error;
    } catch (e) {
        console.log(e);
        return null;
    }
}

exports.update = async (data) => {
    try {
        const error = await Joi.object({
            id: Joi.number().min(1).max(9999999999).required(),
            name: Joi.string().max(255).required().allow('', null),
            serviceRate: Joi.number().min(0).max(9999999999).required().allow(0),
            desc: Joi.string().max(1024).required().allow('', null),
            image: Joi.object().allow('', null),
            deleteImage: Joi.string().max(255).required().allow('', null),
        }).validate(data);

        return error;
    } catch (e) {
        console.log(e);
        return null;
    }
}