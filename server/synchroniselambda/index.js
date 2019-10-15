const dynamodbfordummies = require('./dynamofordummies')

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    console.log('event', event)
    if (event.httpMethod == 'post'){
        for (var i in event.body.flashDecks){
            flashDeck = event.body.flashDecks[i]
            console.log('flashDeck', flashDeck)
            await dynamodbfordummies.putItem(flashDeck, process.env.FLASHDECK_TABLE_NAME)
        }
    }
    returnObject.body = JSON.stringify({
        answer:'helloworld'
    })
    return returnObject
}