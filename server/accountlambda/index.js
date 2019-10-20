const bcrypt = require('bcryptjs');
const dynamodbfordummies = require('dynamofordummies');
const tokenUtility = require('tokenutility');

exports.handler = async (event, context) => {
    async function hashAPass(password) {
        let hashed = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                console.log("HASH", hash);
                resolve(hash)
            });
        });
        return hashed
    }

    let returnObject = {}
    returnObject.statusCode = 200
    console.log('event', event)
    var reply = {}
    if (event.httpMethod == 'post') {
        if (event.body.grant_type) {
            let user = await dynamodbfordummies.getItem(event.body.userName, process.env.USER_TABLE_NAME)
            let _compare = await new Promise((resolve, reject) => {
                bcrypt.compare(event.body.password, user.password, function (err, res) {
                    console.log('err, res', err, res)
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            }).then(res => {
                return true;
            }).catch(error => {
                return false
            });
            if (_compare) {
                let tokenPair = tokenUtility.generateNewPair(event.body.userName, 'all')
                reply.token = tokenPair.signedJwt
                reply.refresh = tokenPair.signedRefresh
            }
        } else {
            event.body.id = event.body.userName
            event.body.password = await hashAPass(event.body.password)
            let dynamoItem = await dynamodbfordummies.putItem(event.body, process.env.USER_TABLE_NAME)
            let tokenPair = tokenUtility.generateNewPair(event.body.id, 'all')
            reply.token = tokenPair.signedJwt
            reply.refresh = tokenPair.signedRefresh
        }
    }
    returnObject.body = JSON.stringify(reply)
    return returnObject
}