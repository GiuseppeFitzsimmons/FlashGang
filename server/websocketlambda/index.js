const dynamodbfordummies = require('dynamofordummies')
const mailUtility = require('mailutility')
const tokenUtility = require('tokenutility');
const AWS = require('aws-sdk');
const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    //endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
});

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    var token;
    if  (event.body && event.body.type){
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
        } else if (event.body.type == 'deckUpdate'){
            console.log('WS body', event.body)
            let flashDeckId = event.body.flashDeckId
            let users = await dynamodbfordummies.getDeckUsers(flashDeckId)
            let message = {type: 'deckUpdate', flashDeckId: flashDeckId}
            users.forEach(async user=>{
                console.log('WS user', user)
                let connections = await dynamodbfordummies.getWebsocketConnection(user.userId)
                console.log('WS connections', connections)
                connections.forEach(async connection=>{
                    let promiseToSend = apigwManagementApi.postToConnection({ ConnectionId: connection.connectionId, Data: message }).promise();
                    await promiseToSend.then(sent=>{
                        console.log('sent', sent)
                    }).catch(err=>{
                        console.log(err)
                        dynamodbfordummies.deleteConnection(connection.connectionId, user.userId)
                    })
                })
            })
            
        }
    }
    returnObject.body = JSON.stringify(reply);
    return returnObject
}