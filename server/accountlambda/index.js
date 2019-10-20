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
        event.body.id = event.body.userName
        event.body.password = await hashAPass(event.body.password)
        let dynamoItem = await dynamodbfordummies.putItem(event.body, process.env.USER_TABLE_NAME)
        let tokenPair = tokenUtility.generateNewPair(event.body.id, 'all')
        reply.token = tokenPair.signedJwt
        reply.refresh = tokenPair.signedRefresh
    }
    returnObject.body = JSON.stringify(reply)
    return returnObject
}