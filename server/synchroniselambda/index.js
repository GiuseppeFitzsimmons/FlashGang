const dynamodbfordummies = require('./dynamofordummies')

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    console.log('event', event)
    let now=new Date();
    if (event.httpMethod == 'post'){
        //store all the flashcards sent from the user
        for (var i in event.body.flashDecks){
            flashDeck = event.body.flashDecks[i]
            flashDeck.lastModified=now.getTime();
            console.log('flashDeck', flashDeck)
            await dynamodbfordummies.putItem(flashDeck, process.env.FLASHDECK_TABLE_NAME)
        }
        //return all the flashcards to which the user has access and which have a lastModified date
        //later than the 
    }
    returnObject.body = JSON.stringify({
        answer:'helloworld'
    })
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
			"description": "My homeys studying the multiplication tables",
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