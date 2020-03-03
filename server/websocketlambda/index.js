const dynamodbfordummies = require('dynamofordummies')
const mailUtility = require('mailutility')
const tokenUtility = require('tokenutility');

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    var token;
    if  (event.body.type){
        try {
            token = tokenUtility.validateToken(event);
        } catch(badtoken) {
            console.log('badtoken', badtoken, event);
            returnObject.statusCode=badtoken.statusCode;
            reply=badtoken;
        }
        let userId = token.sub;
        if (event.body.type == 'handshake'){
            let connectionId = event.requestContext.connectionId
            await dynamodbfordummies.putWebsocketConnection(connectionId, userId)
            let connection = await dynamodbfordummies.getWebsocketConnection(userId)
        }
        if (event.body.type == 'deckUpdate'){
            let flashDeckId = event.requestContext.flashDeckId
            let users = await dynamodbfordummies.getDeckUsers(flashDeckId)
        }
    }
    return returnObject
}