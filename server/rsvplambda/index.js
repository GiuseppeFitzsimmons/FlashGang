const dynamodbfordummies = require('dynamofordummies')

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    var token = validateToken(event);
    console.log("RSVP", event.body);
    if (event.httpMethod == 'post') {
        if (event.body) {
            if (event.body.flashGangId && event.body.hasOwnProperty('acceptance')) {
                if (event.body.acceptance) {
                    let flashGang = await dynamodbfordummies.getFlashGang(event.body.flashGangId)
                    let membership = await flashGang.members.filter(member=>
                        member.id == token.sub
                    )
                    if (membership.length>0){
                        membership = membership[0]
                    }
                    console.log('membership', membership)
                    dynamodbfordummies.putItem({
                        id: token.sub,
                        flashGangId: event.body.flashGangId,
                        lastModified: new Date().getTime(),
                        state: 'ACCEPTED',
                        rank: membership.rank
                    },
                        process.env.FLASHGANG_MEMBER_TABLE_NAME
                    )

                } else {
                    dynamodbfordummies.removeFlashGangMember(token.sub, event.body.flashGangId);
                }
            } else {
                reply.message = 'Error'
                returnObject.statusCode = 403
            }
        }
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
    if (token.toLowerCase().indexOf('bearer') == 0) {
        token = token.substr(7);
    }
    let splitted = token.split(".");
    if (splitted.length < 2) {
        return
    }
    let buff = new Buffer(splitted[1], 'base64');
    let decoded = buff.toString('ascii');
    decoded = JSON.parse(decoded);
    return decoded;
}