const JWT = require('jsonwebtoken');
const { internalServer } = require('../utils');
const db = require('../models');


module.exports = async (req, res, next) => {
    try {

        // get token
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                status: 401,
                success: false,
                data: 'Unauthorize',
                obj: null,
            });
        }

        // split token 
        const token = authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                status: 401,
                success: false,
                data: 'Invalid token',
                obj: null,
            });
        }

        // check existing token
        let checkToken = await db.UserTokens.findOne({ where: { token: token } });
        if (!checkToken) {
            return res.status(401).json({
                status: 401,
                success: false,
                data: 'Unauthorize',
                obj: null
            });
        }


        // verify token
        let secretKey = process.env.JWT_SECRET ?? "";
        let [decoded, error] = await JWT.verify(token, secretKey, function (err, decoded) {
            // handle error
            if (err) {
                return [null, err];
            }
            // decode
            return [decoded, null];
        });

        // handle error
        if (error) {

            // clear token
            await db.UserTokens.destroy({ where: { token: token } });

            return res.status(401).json({
                status: 401,
                success: false,
                data: error.message,
                obj: error
            })
        }

        // check identity
        const user = await db.User.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                data: 'Invalid Account',
                obj: null,
            });
        }

        // set variable
        req.userId = user.id;
        req.token = token;

        next();
        return;

    } catch (e) {
        console.log('err middleware: ', e);
        return res.json(internalServer);
    }
};