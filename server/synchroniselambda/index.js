const dynamodbfordummies = require('./dynamofordummies')

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    console.log('event', event)
    let now=new Date();
    var reply={}
    if (event.httpMethod == 'post'){
        //store all the flashcards sent from the user
        for (var i in event.body.flashDecks){
            flashDeck = event.body.flashDecks[i]
            flashDeck.lastModified=now.getTime();
            console.log('flashDeck', flashDeck)
            await dynamodbfordummies.putItem(flashDeck, process.env.FLASHDECK_TABLE_NAME)
        }
        //return all the flashcards to which the user has access and which have a lastModified date
        //later than the date passed in the request (TODO - user id and lastModified date)
        var allFlashDecks=await dynamodbfordummies.getFlashDecks(null, 0, process.env.FLASHDECK_TABLE_NAME);
        reply.flashDecks=allFlashDecks;
    }
    returnObject.body = JSON.stringify(reply)
    return returnObject
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