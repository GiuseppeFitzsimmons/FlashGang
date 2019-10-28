const bcrypt = require('bcryptjs');
const dynamodbfordummies = require('dynamofordummies');
const tokenUtility = require('tokenutility');
const mailUtility = require('mailutility')

exports.handler = async (event, context) => {
    async function hashAPass(password) {
        let hashed = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                resolve(hash)
            });
        });
        return hashed
    }

    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    console.log('event.body', event.body)
    if (event.httpMethod == 'post') {
        if (event.body.grant_type) {
            //Login sequence
            if (event.body.grant_type == 'password') {
                let userId = event.body.id ? event.body.id.toLowerCase() : ''
                if (userId != '') {
                    let user = await dynamodbfordummies.getItem(userId, process.env.USER_TABLE_NAME)
                    console.log('user', user)
                    let _compare = await new Promise((resolve, reject) => {
                        bcrypt.compare(event.body.password, user.password, function (err, res) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(res);
                            }
                        });
                    }).then(res => {
                        return res;
                    }).catch(error => {
                        return false
                    });
                    if (_compare) {
                        let tokenPair = tokenUtility.generateNewPair(event.body.id, 'all')
                        reply.token = tokenPair.signedJwt
                        reply.refresh = tokenPair.signedRefresh
                    } else {
                        reply.errors = { fields: [{ id: `Email and password do not match` }, { password: `Email and password do not match` }] }
                        returnObject.statusCode = 401
                    }
                } else {
                    reply.errors = { fields: [{ id: `Email and password do not match` }, { password: `Email and password do not match` }] }
                    returnObject.statusCode = 401
                }

            } else if (event.body.grant_type == 'refresh') {
                let decodedAccessToken;
                let decodedRefreshAccessToken;
                try {
                    decodedAccessToken = jwtUtility.validateToken(event, true)
                    event.authorizationToken = event.body.token
                    decodedRefreshAccessToken = jwtUtility.validateToken(event, false)
                }
                catch (err) { }
                if (decodedAccessToken && decodedRefreshAccessToken && decodedAccessToken.uuid == decodedRefreshAccessToken.uuid) {
                    let tokenPair = tokenUtility.generateNewPair(decodedRefreshAccessToken.sub, 'all')
                    reply.token = tokenPair.signedJwt
                    reply.refresh = tokenPair.signedRefresh
                } else {
                    returnObject.statusCode = 401
                }
            }
        } else if (event.body.account_function) {
            let userId = event.body.id ? event.body.id.toLowerCase() : ''
            console.log('userId', userId)
            let user = await dynamodbfordummies.getItem(userId, process.env.USER_TABLE_NAME)
            if (event.body.account_function == 'resetpw') {
                let tokenPair = tokenUtility.generateNewPair(userId, 'resetpw')
                await mailUtility.sendResetEmail(userId, tokenPair.signedJwt)
            } else if (event.body.account_function == 'setpw') {
                console.log('event.body.token', event.body.token)
                let token = tokenUtility.validateToken(event)
                if (token && token.sub == event.body.id && token.scope == 'resetpw') {
                    console.log('user', user)
                    user.password = await hashAPass(event.body.password)
                    await dynamodbfordummies.putItem(user, process.env.USER_TABLE_NAME)
                    let tokenPair = tokenUtility.generateNewPair(user.id, 'all')
                    reply.token = tokenPair.signedJwt
                    reply.refresh = tokenPair.signedRefresh
                } else {
                    reply.errors = { fields: [{ id: `Bad request` }] }
                    returnObject.statusCode = 401
                }
            }
        } else {
            //Account creation sequence
            console.log("EVENT DOT BODY", event.body, event.body.id);
            event.body.id = event.body.id.toLowerCase()
            let user = await dynamodbfordummies.getItem(event.body.id.toLowerCase(), process.env.USER_TABLE_NAME)
            if (!user) {
                event.body.password = await hashAPass(event.body.password)
                let dynamoItem = await dynamodbfordummies.putItem(event.body, process.env.USER_TABLE_NAME)
                let tokenPair = tokenUtility.generateNewPair(event.body.id, 'all')
                reply.token = tokenPair.signedJwt
                reply.refresh = tokenPair.signedRefresh
            } else {
                reply.errors = { fields: [{ id: `${event.body.id} is already taken` }, { userName: `${event.body.id} is already taken` }] }
            }
        }
    }
    returnObject.body = JSON.stringify(reply)
    return returnObject
}