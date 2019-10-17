const AWS = require('aws-sdk');

async function getFlashDecks(userId, lastModifiedDate) {
    //TODO
    /*
    var params = {
    TableName: 'CrockStack-flashdeck-user-table',
    IndexName: 'userId_index', // optional (if querying an index)
    KeyConditionExpression: 'userId = :value and lastModified > :lm', // a string representing a constraint on the attribute
    
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
      ':value': 'phillip@flash.com',
      ':lm': 1571318216307
    },
    ScanIndexForward: true
};
    */
    var params = {
        TableName: process.env.FLASHDECK_TABLE_NAME,
        FilterExpression : 'lastModified > :ldate',
        ExpressionAttributeValues: {
          ':ldate': lastModifiedDate
        }
    }
    
    var documentClient = getDocumentDbClient();
    let decks = await new Promise((resolve, reject) => {
        documentClient.scan(params, function (err, data) {
            if (err) {
                console.log(err);
                resolve();
            } else {
                console.log(data);
                resolve(data.Items)
            }
        });
    })
    return decks;
}
async function putFlashDeck(flashDeck, userId) {
    let now=new Date();
    flashDeck.lastModified=now.getTime();
    await putItem(flashDeck, process.env.FLASHDECK_TABLE_NAME)
    let flashDeckOwner={
        userId: userId,
        flashDeckId: flashDeck.id,
        lastModified: flashDeck.lastModified,
        role: 'BOSS'
    }
    await putItem(flashDeckOwner, process.env.FLASHDECK_USER_TABLE_NAME)
}

async function putItem(item, tableName) {
    console.log('tableName', tableName)
    var params = {
        TableName: tableName,
        Item: item
    };
    console.log(params);
    var documentClient = getDocumentDbClient();
    let updatedItem = await new Promise((resolve, reject) => {
        documentClient.put(params, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(data);
                resolve(data);
            }
        });
    });
    return item
}

function getDocumentDbClient() {
    console.log("process.env.REGION", process.env.REGION, process.env.DYNAMODB_ENDPOINT);
    if (process.env.REGION) {
        if (process.env.DYNAMODB_ENDPOINT && process.env.DYNAMODB_ENDPOINT != '') {
            AWS.config.update({
                region: process.env.REGION,
                endpoint: process.env.DYNAMODB_ENDPOINT
            });
        }
    }
    var documentClient = new AWS.DynamoDB.DocumentClient();
    return documentClient;
}

async function getItem(id, tableName) {
    var params = {
        TableName: tableName,
        Key: {
            'id': id
        }
    };
    var documentClient = new AWS.DynamoDB.DocumentClient();
    let item = await new Promise((resolve, reject) => {
        documentClient.get(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                console.log("Success", data.Item);
                resolve(data.Item);
            }
        });
    });
    return mapToObject(item);
}
async function removeItem(id, tableName) {
    const ddb = getDBClient();
    var params = {
        TableName: tableName,
        Key: {
            'id': id
        }
    };
    var documentClient = new AWS.DynamoDB.DocumentClient();
    let item = await new Promise((resolve, reject) => {
        documentClient.deleteItem(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                console.log("sucess deleting", id);
                resolve(data);
            }
        });
    });
    return item;
}


module.exports = {
    putItem,
    removeItem,
    getItem,
    getFlashDecks,
    putFlashDeck
}