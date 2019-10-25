const dynamodbfordummies = require('dynamofordummies')
const mailUtility = require('mailutility')

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    var token = validateToken(event);
    if (event.httpMethod == 'post') {
        //store all the flashcards sent from the user
        //TODO deletions
        if (event.body.flashDecks) {
            for (var i in event.body.flashDecks) {
                flashDeck = event.body.flashDecks[i]
                await dynamodbfordummies.putFlashDeck(flashDeck, token.sub)
            }
        }
        //store all the flashgangs sent from the user
        if (event.body.flashGangs) {
            for (var i in event.body.flashGangs) {
                flashGang = event.body.flashGangs[i]
                if (flashGang.members) {
                    for (var j in flashGang.members) {
                        let member = flashGang.members[j]
                        if (!member.id){
                            continue
                        }
                        if (member.state == 'TO_INVITE'){
                            let user = await dynamodbfordummies.getItem(token.sub, process.env.USER_TABLE_NAME)
                            let invitor=token.sub;
                            if (user.firstName || user.lastName) {
                                invitor=`${user.firstName ? user.firstName: ''} ${user.lastName ? user.lastName : ''}`
                            }
                            //await mailUtility.sendInvitationMail(invitor, member.email, flashGang.name)
                            member.state = 'INVITED'
                            member.invitedBy=token.sub;
                            console.log("INVITEDBY BUG SAVING MEMBER", member);
                        }
                    }
                }
                await dynamodbfordummies.putFlashGang(flashGang, token.sub)
            }
        }
        let lastModified = event.body.lastModified ? event.body.lastModified : 0;
        //return all the flashcards to which the user has access and which have a lastModified date
        //later than the date passed in the request
        reply = await dynamodbfordummies.getFlashDecks(token.sub, lastModified);
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
    if (token.toLowerCase().indexOf('bearer')==0) {
        token=token.substr(7);
    }
    let splitted = token.split(".");
    if (splitted.length<2){
        return
    }
    let buff = new Buffer(splitted[1], 'base64');
    let decoded = buff.toString('ascii');
    decoded = JSON.parse(decoded);
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
					"rank":"SOTTOCAPPO"
				}
			],
			"flashdecks":["10"]
		}
	]
}


*/