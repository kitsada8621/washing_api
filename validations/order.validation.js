const Joi = require('joi');

exports.createOrder = async (payload) => {
    try {

        let error = await Joi.object({
            washerId: Joi.number().min(1).max(9999999999).required(),
            amount: Joi.number().min(1).max(9999999999).required(),
        }).validate(payload);

        return error;
    } catch (e) {
        console.log('err', e);
        return null;
    }
}