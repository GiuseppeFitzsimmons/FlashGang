const AWS = require('aws-sdk');

async function getFlashDecksOld(userId, lastModifiedDate) {
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
   const result={};
    const params = {
        TableName: process.env.FLASHDECK_USER_TABLE_NAME,
        KeyConditionExpression : 'userId = :uid and lastModified > :ldate',
        IndexName: 'userId_index',
        ExpressionAttributeValues: {
          ':ldate': lastModifiedDate,
          ':uid': userId
        }
    }
    
    var documentClient = getDocumentDbClient();
    let userDecks = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log(err);
                resolve();
            } else {
                console.log(data);
                resolve(data.Items)
            }
        });
    })
    for (var i in userDecks) {
        //These decks belong to this user, so he's the boss
        userDecks[i].rank='BOSS';
    }
    console.log("USER DECKS ", userDecks);
    params.TableName=process.env.FLASHGANG_MEMBER_TABLE_NAME
    params.KeyConditionExpression='memberId = :uid and lastModified > :ldate';
    
    let userGangs = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log(err);
                resolve();
            } else {
                console.log(data);
                resolve(data.Items)
            }
        });
    })
    console.log("USER GANGS ", userGangs);
    result.flashGangs=[];
    result.flashGangsters=[];
    for (var i in userGangs) {
        let userGang=userGangs[i];
        console.log("USER GANG", userGang)
        let flashGang=await getItem(userGang.flashGangId, process.env.FLASHGANG_TABLE_NAME);
        console.log("USER FLASHGANG", flashGang)
        result.flashGangs.push(flashGang);
        //put the decks of this gang into the list of gangs, if it's not already there
        if (flashGang.flashDecks) {
            for (var j in flashGang.flashDecks) {
                let gangDeckId=flashGang.flashDecks[j];
                let existing=userDecks.filter(deck=>{deck.id==gangDeckId})
                if (existing.length==0) {
                    userDecks.push({
                        flashDeckId: gangDeckId,
                        rank: userGang.rank,
                        lastModified: userGang.lastModified
                    })
                }
            }
        }
        //put the members of this gang into the list of gangsters, if it's not already there
        if (flashGang.members) {
            for (var j in flashGang.members) {
                let gangMember=flashGang.members[j];
                let existing=result.flashGangsters.filter(gm=>gm.id==gangMember.id);
                if (existing.length==0) {
                    console.log("USER GANGMEMBER", gangMember)
                    if (gangMember.id){
                        let gangster=await getItem(gangMember.id, process.env.FLASHGANG_TABLE_NAME);
                        console.log("USER GANGSTER", gangster)
                        result.flashGangsters.push(gangster);
                    }
                }
            }
        }
    }
    //now the result should have gangs and gangsters, and we have an array called decks
    //composed of the IDs of decks that the user directly created and those to which he's associated
    //because he belongs to a gang which has some decks
    result.flashDecks=[];
    for (var i in userDecks) {
        let userDeck=userDecks[i];
        let flashDeck=await await getItem(userDeck.flashDeckId, process.env.FLASHDECK_TABLE_NAME);
        flashDeck.rank=userDeck.rank;
        result.flashDecks.push(flashDeck);
    }

    return result;
}
async function putFlashDeck(flashDeck, userId) {
    let now=new Date();
    flashDeck.lastModified=now.getTime();
    await putItem(flashDeck, process.env.FLASHDECK_TABLE_NAME)
    let flashDeckOwner={
        userId: userId,
        flashDeckId: flashDeck.id,
        lastModified: flashDeck.lastModified,
        rank: 'BOSS'
    }
    await putItem(flashDeckOwner, process.env.FLASHDECK_USER_TABLE_NAME)
}
async function putFlashGang(flashGang, userId) {
    let now=new Date();
    flashGang.lastModified=now.getTime();
    await putItem(flashGang, process.env.FLASHGANG_TABLE_NAME)
    const flashGangMember={
        memberId: userId,
        flashGangId: flashGang.id,
        lastModified: flashGang.lastModified,
        rank: 'BOSS'
    }
    await putItem(flashGangMember, process.env.FLASHGANG_MEMBER_TABLE_NAME)
    if (flashGang.members) {
        for (var i in flashGang.members) {
            flashGangMember.memberId=flashGang.members[i].userId;
            flashGangMember.rank=flashGang.members[i].rank;
        }
    }
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
    console.log("GET ITEM ", id, tableName);
    let lastModifiedDate=0;
    var params = {
        TableName: tableName,
        /*Key: {
            'id': id
        }*/
        
        KeyConditionExpression : 'id = :uid and lastModified > :ldate',
        ExpressionAttributeValues: {
          ':ldate': lastModifiedDate,
          ':uid': id
        }
    };
    var documentClient = new AWS.DynamoDB.DocumentClient();
    let item = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log("Error", params, err);
                reject(err);
            } else {
                console.log("Success", data);
                if (data.Items) {
                    if (data.Items.length>0) {
                        resolve(data.Items[0]);
                    } else {
                        resolve();
                    }
                } else {
                    resolve(data);
                }
            }
        });
    });
    console.log("GET item", item)
    return item;
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
    putFlashDeck,
    putFlashGang
}