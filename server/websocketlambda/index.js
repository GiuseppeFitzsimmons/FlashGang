const dynamodbfordummies = require('dynamofordummies')
const mailUtility = require('mailutility')
const tokenUtility = require('tokenutility');
const AWS = require('aws-sdk');
const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    //endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
});

exports.handler = async (event, context) => {
    console.log("Websocket lambda enter", event);
    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    var token;
    let _body=event.body;
    if (_body && typeof _body=='string') {
        _body=JSON.parse(event.body);
    }
    if  (_body && _body.type){
        try {
            token = tokenUtility.validateToken(event);
        } catch(badtoken) {
            console.log('badtoken', badtoken, event);
            returnObject.statusCode=badtoken.statusCode;
            reply=badtoken;
        }
        let userId = token.sub;
        if (_body.type == 'handshake'){
            console.log('handshake made')
            let connectionId = event.requestContext.connectionId
            await dynamodbfordummies.putWebsocketConnection(connectionId, userId)
            //let connection = await dynamodbfordummies.getWebsocketConnection(userId)
        } else if (_body.type == 'deckUpdate'){
            console.log('WS body', _body)
            let flashDeckId = _body.flashDeckId
            let users = await dynamodbfordummies.getDeckUsers(flashDeckId);
            console.log("users", users);
            let message = {type: 'deckUpdate', flashDeckId: flashDeckId};
            users.forEach(async user=>{
                console.log('WS user', user)
                let connections = await dynamodbfordummies.getWebsocketConnection(user)
                console.log('WS connections', connections)
                connections.forEach(async connection=>{
                    let promiseToSend = apigwManagementApi.postToConnection({ ConnectionId: connection.connectionId, Data: message }).promise();
                    await promiseToSend.then(sent=>{
                        console.log('sent', user, connection.connectionId)
                    }).catch(err=>{
                        console.log(err)
                        dynamodbfordummies.deleteConnection(connection.connectionId, user)
                    })
                })
            })
            
        }
    }
    returnObject.body = JSON.stringify(reply);
    return returnObject
}