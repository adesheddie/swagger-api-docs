var jwt = require('jwt-simple'),  //JASON WITH TOKEN
    config = require('./config.js'),//duration of token, for how long to be logged in
    moment = require('moment');
module.exports = {
    ensureauthenticated: function (req, res, next) {
        if (!req.header.authorization) {
            return res.status(401).send({ message: "Not Authorized" });
        }

        var token = req.headers.authorization.split(' ')[1]; // check token created or not
        var payload = null;                                   // base64-> encode and decode

        try {
            payload = jwt.decode(token, config.TOKEN_SECRET);
        }
        catch (e) {
            return res.status(401).send({ message: err.message });
        }
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: "Token Expired" });
        }

        req.user = payload.sub;
        next();


    },

    createJWT: function (user) {
        console.log(user);
        var payload = {
            sub: user._id,               //subject
            iat: moment().unix(),        //issued time
            exp: moment().add(14, 'days').unix()   //expired, can be set in hours too
        }
        return jwt.encode(payload, config.TOKEN_SECRET);
    }

}
