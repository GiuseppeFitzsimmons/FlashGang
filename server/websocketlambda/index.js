const dynamodbfordummies = require('dynamofordummies')
const mailUtility = require('mailutility')
const tokenUtility = require('tokenutility');
const AWS = require('aws-sdk');

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
    if (event.requestContext.routeKey && event.requestContext.routeKey==='$disconnect') {
        //TODO delete event.requestContext.connectionId from the database
    } else if  (_body && _body.type){
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
            let connectionId = event.requestContext.connectionId;
            await dynamodbfordummies.putWebsocketConnection(connectionId, userId);
        } else if (_body.type == 'update'){
            const apigwManagementApi = new AWS.ApiGatewayManagementApi({
                apiVersion: '2018-11-29',
                endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
            });
            console.log('WS body', _body)
            //let flashDeckId = _body.flashDeckId
            //I'm proposing that we operate on an array of gangs and decks
            //for now I'm just getting the first deck in the array
            let flashDeckId=_body.decks[0];
            let users = {}
            users.gangUsers = []
            for (var i in _body.decks){
                deckUsers = await dynamodbfordummies.getDeckUsers(flashDeckId);
                users.deckUsers = deckUsers
            }
            //              TODO: Add getGangUsers to ddb
            /*let flashGangId = _body.gangs[0];
            for (var i in _body.gangs){
                gangUsers = await dynamodbfordummies.getGangUsers(flashGangId);
                users.push(gangUsers)
            }*/
            console.log("users wslambda", users);
            let message = JSON.stringify({type: 'update'});
            users = users.deckUsers.concat(users.gangUsers)
            console.log('users wslambda concatenated', users)
            //users.forEach(async user=>{
            for (var u in users) {
                let user=users[u];
                console.log('WS user', user)
                let connections = await dynamodbfordummies.getWebsocketConnection(user)
                console.log('WS connections', connections)
                //connections.forEach(async connection=>{
                for (var c in connections) {
                    let connection=connections[c];
                    let promiseToSend = apigwManagementApi.postToConnection({ ConnectionId: connection.connectionId, Data: message }).promise();
                    await promiseToSend.then(sent=>{
                        console.log('sent', user, connection.connectionId)
                    }).catch(err=>{
                        console.log(err)
                        dynamodbfordummies.deleteConnection(connection.connectionId, user)
                    })
                }
                //})
            }
            //})
            
        }
    }
    returnObject.body = JSON.stringify(reply);
    return returnObject
}