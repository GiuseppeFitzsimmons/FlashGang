const bcrypt = require('bcryptjs');
const dynamodbfordummies = require('dynamofordummies');
const tokenUtility = require('tokenutility');
const mailUtility = require('mailutility')
const fs = require('fs');
const uuidv4 = require('uuid/v4');
var AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    async function hashAPass(password) {
        let hashed = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                resolve(hash)
            });
        });
        return hashed
    }
    //var token = tokenUtility.validateToken(event);
    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    if (typeof event.body === 'string') {
        event.body = JSON.parse(event.body)
    }
    if (event.httpMethod.toLowerCase() === 'post') {
        if (event.body.grant_type) {
            //Login sequence
            if (event.body.grant_type == 'password') {
                let userId = event.body.id ? event.body.id.toLowerCase() : ''
                if (userId != '') {
                    let user = await dynamodbfordummies.getItem(userId, process.env.USER_TABLE_NAME)
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
                        reply.user = await dynamodbfordummies.getUser(event.body.id)
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
                    console.log("validating expired access token", event);
                    decodedAccessToken = tokenUtility.validateToken(event, true);
                    event.authorizationToken = event.body.token;
                    console.log("validating expired refresh token", event.authorizationToken);
                    decodedRefreshAccessToken = tokenUtility.validateToken(event, false)
                } catch (err) { 
                    console.log("Error validating expired access token", err, event);
                }
                if (decodedAccessToken && decodedRefreshAccessToken && decodedAccessToken.uuid == decodedRefreshAccessToken.uuid) {
                    let tokenPair = tokenUtility.generateNewPair(decodedRefreshAccessToken.sub, 'all')
                    reply.token = tokenPair.signedJwt
                    reply.refresh = tokenPair.signedRefresh
                } else {
                    returnObject.statusCode = 401
                }
            }
        } else if (event.body.account_function) {
            if (event.body.account_function == 'resetpw') {
                let userId = event.body.id ? event.body.id.toLowerCase() : '';
                let user = await dynamodbfordummies.getItem(userId, process.env.USER_TABLE_NAME)
                let tokenPair = tokenUtility.generateNewPair(userId, 'resetpw')
                await mailUtility.sendResetEmail(userId, tokenPair.signedJwt)
            } else if (event.body.account_function == 'setpw') {
                let userId = event.body.id ? event.body.id.toLowerCase() : '';
                let user = await dynamodbfordummies.getItem(userId, process.env.USER_TABLE_NAME)
                let token;
                try {
                    token = tokenUtility.validateToken(event)
                } catch (badtoken) {
                    reply = badtoken;
                    returnObject.statusCode = badtoken.statusCode;
                }
                if (token) {
                    if (token.sub == event.body.id && token.scope == 'resetpw') {
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

            } else if (event.body.account_function == 'setsettings') {
                var token;
                try {
                    token = tokenUtility.validateToken(event);
                } catch (badtoken) {
                    reply = badtoken;
                    returnObject.statusCode = badtoken.statusCode;
                }
                if (token) {

                    let user = await dynamodbfordummies.getItem(token.sub, process.env.USER_TABLE_NAME)
                    user.id = token.sub
                    if (event.body.nickname) {
                        user.nickname = event.body.nickname
                    }
                    if (event.body.firstName) {
                        user.firstName = event.body.firstName
                    }
                    if (event.body.lastName) {
                        user.lastName = event.body.lastName
                    }
                    if (event.body.picture) {
                        if (event.body.picture.indexOf('data:image') == 0) {
                            var imageData = event.body.picture.split(',');
                            var base64Data = imageData[1];
                            var imageType = imageData[0].toLowerCase().replace("data:image/", '').replace(';base64', '');
                            var subPath = `/avatars/${uuidv4()}.${imageType}`
                            var path = `${process.env.AVATAR_PREFIX}${subPath}`
                            var s3Config = {};
                            if (process.env.S3_ENDPOINT && process.env.S3_ENDPOINT != '') {
                                s3Config.endpoint = process.env.S3_ENDPOINT;
                            }
                            if (process.env.REGION && process.env.REGION != '') {
                                s3Config.region = process.env.REGION;
                            }
                            var s3 = new AWS.S3(s3Config);
                            var bucketParams = {
                                Body: new Buffer(base64Data, 'base64'),
                                Bucket: process.env.AVATAR_BUCKET,
                                Key: path,
                                ContentEncoding: 'base64',
                                ContentType: `image/${imageType}`
                            };
                            //fs.writeFileSync('avatartest.jpg',base64Data, 'base64');
                            let s3result = await new Promise((resolve, reject) => {
                                s3.putObject(bucketParams, function (err, data) {
                                    if (err) {
                                        console.log("Error uploading avatar", err, err.stack);
                                        reject(err);
                                    } else {
                                        console.log("success uploading avatar", data);
                                        resolve(data);
                                    }
                                });
                            })
                            if (s3result.ETag) {
                                //TODO at some point in the future we should have a way that cleans up unused images.
                                user.picture = `https://${process.env.S3_SERVER_DOMAIN}${subPath}`
                            }
                            console.log("s3result", s3result);
                        }
                    }
                    await dynamodbfordummies.putUser(user);
                    reply.user = await dynamodbfordummies.getUser(user.id)

                }
            }
        } else {
            //Account creation sequence
            console.log("EVENT DOT BODY", event.body, event.body.id, typeof event.body);
            event.body.id = event.body.id.toLowerCase();
            console.log("===================1");
            let user = await dynamodbfordummies.getItem(event.body.id.toLowerCase(), process.env.USER_TABLE_NAME);
            console.log("===================2", user);
            if (!user) {
                event.body.password = await hashAPass(event.body.password)
                let dynamoItem = await dynamodbfordummies.putUser(event.body)
                let tokenPair = tokenUtility.generateNewPair(event.body.id, 'all')
                reply.token = tokenPair.signedJwt
                reply.refresh = tokenPair.signedRefresh
                reply.user = await dynamodbfordummies.getUser(event.body.id)
            } else {
                reply.errors = { fields: [{ id: `${event.body.id} is already taken` }, { userName: `${event.body.id} is already taken` }] }
            }
        }
    }
    returnObject.body = JSON.stringify(reply);
    returnObject.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,HEAD,GET,PUT,POST"
    }
    return returnObject
}
/*
function validateToken(event) {
    let token = event.authorizationToken;
    if ((!token || token == '') && event.headers) {
        token = event.headers.Authorization;
        if (!token || token == '') {
            token = event.headers.authorization;
        }
    }
    if (!token || token == '') {
        return;
    }
    if (token.toLowerCase().indexOf('bearer') == 0) {
        token = token.substr(7);
    }
    let splitted = token.split(".");
    if (splitted.length < 2) {
        return
    }
    let buff = new Buffer(splitted[1], 'base64');
    let decoded = buff.toString('ascii');
    decoded = JSON.parse(decoded);
    return decoded;
}
*/