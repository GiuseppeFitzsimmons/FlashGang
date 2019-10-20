const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4')

function getSigningSecret() {
    //TODO something better than this
    return process.env.SIGNING_SECRET
}
function validateToken(event, ignoreExpiration) {
    signingSecret=getSigningSecret();
    var token = event.authorizationToken;
    if ((!token || token == '') && event.headers) {
        token = event.headers.Authorization;
        if (!token || token == '') {
            token = event.headers.authorization;
        }
    }
    console.log("validateToken", token);
    if (!token) {
        err=new Error("Unauthorized");
        err.statusCode=401;
        err.message="Unauthorized";
        console.log("No token, rejecting", err);
        throw err;
    }
    if (token.toLowerCase().indexOf("bearer") == 0) {
        token = token.substr(7);
    }
    var decoded;
    if (!token || token == '') {
        console.log("No token, rejecting...");
        throw fourOhOne();
    }
    try {
        decoded = jwt.verify(token, signingSecret);
        console.log("decoded", decoded)
    } catch (err) {
        console.log(err);
        throw fourOhOne();
    }
    if (decoded) {
        if (ignoreExpiration || new Date().getTime() < decoded.exp) {
            return decoded;
        } else {
            console.log("Token is expired, rejecting...");
            throw fourOhOne("Token has expired", 'exp');
        }
    }
};
function fourOhOne(message, code) {
    if (!message) {
        message="Unauthorized";
    }
    err=new Error(message);
    err.statusCode=401;
    err.message=message;
    if (code) {
        err.code=code;
    }
    return err;
}

function generateNewPair(userId, scope, duration) {
    signingSecret=getSigningSecret();
    tokenPayload = {};
    tokenPayload.iss = 'flashgang';
    tokenPayload.sub = userId;
    tokenPayload.uuid=uuidv4();
    tokenPayload.scope=scope;
    var now = new Date();
    now.setMinutes(now.getMinutes() + duration ? duration : process.env.TOKEN_DURATION ? (process.env.TOKEN_DURATION*1) : 30);
    now = new Date(now);
    tokenPayload.exp = now.getTime();
    var signedJwt = jwt.sign(tokenPayload, signingSecret);
    if (tokenPayload.scope!="PASSWORD") {
        refreshTokenPayload={};
        refreshTokenPayload.sub = userId;
        refreshTokenPayload.uuid = tokenPayload.uuid;
        now.setMinutes(now.getMinutes() + 6*60);
        refreshTokenPayload.exp = now.getTime();
        var signedRefresh = jwt.sign(refreshTokenPayload, signingSecret);
    }
    return {signedJwt, signedRefresh};
}


module.exports = {
    validateToken,
    generateNewPair
};