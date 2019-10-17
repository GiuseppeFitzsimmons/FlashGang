const dynamodbfordummies = require('./dynamofordummies')

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    console.log('event', event)
    var reply={}
    var token=validateToken(event);
    if (event.httpMethod == 'post'){
        //store all the flashcards sent from the user
        for (var i in event.body.flashDecks){
            flashDeck = event.body.flashDecks[i]
            console.log('flashDeck', flashDeck)
            await dynamodbfordummies.putFlashDeck(flashDeck, token.sub)
        }
        //return all the flashcards to which the user has access and which have a lastModified date
        //later than the date passed in the request (TODO - user id and lastModified date)
        var allFlashDecks=await dynamodbfordummies.getFlashDecks(token.sub, 0);
        reply.flashDecks=allFlashDecks;
    }
    returnObject.body = JSON.stringify(reply)
    return returnObject
}
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
    let splitted=token.split(".");
    let buff = new Buffer(splitted[1], 'base64');
    let decoded = buff.toString('ascii');
    decoded=JSON.parse(decoded);
    return decoded;
}
/*
Example post

{
	"flashDecks":[
		{
			"id":"10",
			"name":"The name of the deck",
			"owner": "1000",
			"flashCards":[
				{
					"id":"11",
					"question":"How much?",
					"correctAnswers":[
						"a lot"
					]
				}
			]
		}
	],
	"flashGangs":[
		{
			"id":"11",
			"name":"My gang",
			"description": "My homies studying the multiplication tables",
			"owner": "1000",
			"members":[
				{
					"id":"1001",
					"state":"TO_INVITE",
					"email":"homey@hood.com",
					"rank":"sottocappo"
				}
			],
			"flashdecks":["10"]
		}
	]
}


*/