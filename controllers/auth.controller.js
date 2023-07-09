const db = require('../models');
const { internalServer } = require('../utils');
const { loginValidate } = require('../validations/auth.validation');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {

        let { error } = await loginValidate(req.body);
        if (error) {
            return res.status(422).json({
                status: 422,
                success: false,
                data: 'Unprocessed Content',
                obj: error.details[0].message
            });
        }

        // check user
        var user = await db.User.findOne({
            where: {
                username: req.body.username
            },
        });
        if (!user) {
            return res.status(400).json({
                status: 400,
                success: false,
                data: 'Invalid userName',
                obj: null
            });
        }

        // password compare
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).json({
                status: 400,
                success: false,
                data: 'Invalid password',
                obj: null
            });
        }

        // generate token
        const secretKey = process.env.JWT_SECRET ?? "";
        let token = JWT.sign({ id: user.id, username: user.username }, secretKey, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        // save token
        await db.UserTokens.create({
            userId: user.id,
            token: token
        });

        let obj = { ...user.toJSON(), access_token: token, token_type: 'Bearer' };
        delete obj.password;

        return res.json({
            status: 200,
            success: true,
            data: 'Successfully logged In',
            obj: obj
        });

    } catch (e) {
        console.log('err login: ', e);
        return res.json({ ...internalServer, obj: e.message });
    }
}

exports.profile = async (req, res) => {
    try {

        const user = await db.User.findByPk(req.userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                data: 'Not found user',
                obj: null
            });
        }

        return res.json({
            status: 200,
            success: true,
            data: 'Successfully get profile',
            obj: user
        });

    } catch (e) {
        console.log('err get profile: ', e);
        return res.json({ ...internalServer, obj: e.message });
    }
}

exports.logout = async (req, res) => {
    try {

        // clear token
        await db.UserTokens.destroy({ where: { token: req.token, userId: req.userId } });

        return res.json({
            status: 204,
            success: true,
            data: 'Successfully logged out',
            obj: null
        });

    } catch (e) {
        console.log('err: ', e);
        return res.json(internalServer);
    }
}