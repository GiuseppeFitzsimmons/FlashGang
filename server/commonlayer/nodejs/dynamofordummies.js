const { generateNewPair } = require('tokenutility')

const AWS = require('aws-sdk');


async function getFlashDecks(userId, lastModifiedDate) {
   const result={};
    const params = {
        TableName: process.env.FLASHDECK_USER_TABLE_NAME,
        KeyConditionExpression : 'userId = :uid and lastModified > :ldate',
        IndexName: 'last_modified_index',
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
    result.flashGangs=[];
    result.flashGangsters=[];
    for (var i in userGangs) {
        let userGang=userGangs[i];
        let flashGang=await getItem(userGang.flashGangId, process.env.FLASHGANG_TABLE_NAME);
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
                    //let gangster=await getItem(gangMember.id, process.env.FLASHGANG_TABLE_NAME);
                    //result.flashGangsters.push(gangster);
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
        let exists=result.flashDecks.filter(deck=>deck.id===userDeck.flashDeckId);
        if (exists.length==0) {
            let flashDeck=await getItem(userDeck.flashDeckId, process.env.FLASHDECK_TABLE_NAME);
            flashDeck.rank=userDeck.rank;
            result.flashDecks.push(flashDeck);
        }
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
    //TODO
    //Now do the same thing for all gang-to-template records - the lastModified needs to be
    //updated so that subsequent calls to synchronise from gang members know that there's been
    //a change to this deck.
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
            let member=flashGang.members[i];
            flashGangMember.memberId=member.userId ? member.userId : member.email;
            flashGangMember.rank=member.rank;
            flashGangMember.email=member.email;
            flashGangMember.state=member.state;
            //if state is "TO_INVITE" then we need to generate an invitation token
            //TODO this should be done asynchronously
            if (flashGangMember.state==='TO_INVITE') {
                let invitationToken=generateNewPair(flashGangMember.memberId, "REGISTER", (60*24*7));
                flashGangMember.invitationToken=invitationToken.signedJwt;
                console.log("FOR TESTING PURPOSES, this is the user to be invited", flashGangMember);
            }
            await putItem(flashGangMember, process.env.FLASHGANG_MEMBER_TABLE_NAME)
        }
    }
}

async function putItem(item, tableName) {
    var params = {
        TableName: tableName,
        Item: item
    };
    console.log(params);
    var documentClient = getDocumentDbClient();
    let updatedItem = await new Promise((resolve, reject) => {
        documentClient.put(params, function (err, data) {
            if (err) {
                console.log("putItem error ",params, err);
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
    return item;
}

async function getItemMaybe(id, tableName) {
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