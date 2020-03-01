const dynamodbfordummies = require('dynamofordummies')
const mailUtility = require('mailutility')
const tokenUtility = require('tokenutility');

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    var token;
    try {
        token = tokenUtility.validateToken(event);
    } catch(badtoken) {
        console.log('badtoken', badtoken, event);
        returnObject.statusCode=badtoken.statusCode;
        reply=badtoken;
    }
    let userId = token.sub;
    if  (event.body.type){
        if (event.body.type == 'handshake'){
            let connectionId = event.requestContext.connectionId
            await dynamodbfordummies.putWebsocketConnection(connectionId, userId)
        }
    }
    return returnObject
}