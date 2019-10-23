const { generateNewPair } = require('tokenutility')

const AWS = require('aws-sdk');


async function getFlashDecks(userId, lastModifiedDate) {
    const result = {};
    const params = {
        TableName: process.env.FLASHDECK_USER_TABLE_NAME,
        KeyConditionExpression: 'userId = :uid and lastModified > :ldate',
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
        userDecks[i].rank = 'BOSS';
    }
    params.TableName = process.env.FLASHGANG_MEMBER_TABLE_NAME
    params.KeyConditionExpression = 'id = :uid and lastModified > :ldate';
    let userGangs = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log("Failed to get flashangs for user", userId, err);
                resolve();
            } else {
                console.log("Getting flasghangs for user", userId, data);
                resolve(data.Items)
            }
        });
    })
    result.flashGangs = [];
    result.users = [];
    //push the current user into this list, and decorate the record with subscription information
    let currentUser=await getItem(userId, process.env.USER_TABLE_NAME);
    currentUser.isCurrentUser=true;
    currentUser.profile=getProfile(currentUser.subscription);
    result.users.push(currentUser);
    for (var i in userGangs) {
        let userGang = userGangs[i];
        //let flashGang = await getItem(userGang.flashGangId, process.env.FLASHGANG_TABLE_NAME);
        let flashGang=await getFlashGang(userGang.flashGangId);
        flashGang.rank=userGang.rank;
        flashGang.state=userGang.state;
        result.flashGangs.push(flashGang);
        //put the decks of this gang into the list of gangs, if it's not already there
        if (flashGang.flashDecks) {
            for (var j in flashGang.flashDecks) {
                let gangDeckId = flashGang.flashDecks[j];
                let existing = userDecks.filter(deck => { deck.id == gangDeckId })
                if (existing.length == 0) {
                    userDecks.push({
                        flashDeckId: gangDeckId,
                        rank: userGang.rank,
                        lastModified: userGang.lastModified,
                        state: userGang.state
                    })
                }
            }
        }
        //put the members of this gang into the list of users, if it's not already there
        if (flashGang.members) {
            for (var j in flashGang.members) {
                let gangMember=flashGang.members[j]
                let existing = result.users.filter(gm => gm.id == gangMember.id);
                if (existing.length == 0) {
                    let gangster=await getItem(gangMember.id, process.env.USER_TABLE_NAME);
                    result.users.push(gangster);
                }
            }
        }
    }
    //now the result should have gangs and gangsters, and we have an array called decks
    //composed of the IDs of decks that the user directly created and those to which he's associated
    //because he belongs to a gang which has some decks
    result.flashDecks = [];
    for (var i in userDecks) {
        let userDeck = userDecks[i];
        let exists = result.flashDecks.filter(deck => deck.id === userDeck.flashDeckId);
        if (exists.length == 0) {
            let flashDeck = await getItem(userDeck.flashDeckId, process.env.FLASHDECK_TABLE_NAME);
            flashDeck.rank = userDeck.rank;
            flashDeck.state = userDeck.state;
            result.flashDecks.push(flashDeck);
        }
    }

    return result;
}
const subscriptionLevels={
    none: {
        maxDecks:5,
        maxCardsPerDeck:20,
        maxGangs:2,
        maxMembersPerGang:5
    },
    associate: {
        maxDecks:15,
        maxCardsPerDeck:99,
        maxGangs:5,
        maxMembersPerGang:10
    },
    admin: {
        maxDecks:99,
        maxCardsPerDeck:199,
        maxGangs:30,
        maxMembersPerGang:99
    },
    superadmin: {
        maxDecks:-1,
        maxCardsPerDeck:-1,
        maxGangs:-1,
        maxMembersPerGang:-1
    }
}
function getProfile(subscriptionLevel) {
    let profile=subscriptionLevels[subscriptionLevel];
    if (!profile) {
        profile=subscriptionLevels.none;
    }
    return profile;
}
async function getFlashGang(id) {
    let flashGang = await getItem(id, process.env.FLASHGANG_TABLE_NAME);
    //query the gang-member table for members
    const params = {
        TableName: process.env.FLASHGANG_MEMBER_TABLE_NAME,
        KeyConditionExpression: 'flashGangId = :id',
        IndexName: 'gang_index',
        ExpressionAttributeValues: {
            ':id': id
        }
    }
    var documentClient = getDocumentDbClient();
    flashGang.members = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log("Failed to get flashgang members from DB", err);
                resolve();
            } else {
                resolve(data.Items)
            }
        });
    })
    return flashGang;

}
async function putFlashDeck(flashDeck, userId) {
    let now = new Date();
    flashDeck.lastModified = now.getTime();
    await putItem(flashDeck, process.env.FLASHDECK_TABLE_NAME)
    let flashDeckOwner = {
        userId: userId,
        flashDeckId: flashDeck.id,
        lastModified: flashDeck.lastModified,
        rank: 'BOSS'
    }
    await putItem(flashDeckOwner, process.env.FLASHDECK_USER_TABLE_NAME)
}
async function putFlashGang(flashGang, userId) {
    let now = new Date();
    flashGang.lastModified = now.getTime();
    if (!flashGang.members) {
        flashGang.members=[]
    }
    let existing=flashGang.members.filter(member=>{
        return member.id==userId;
    })
    if (existing.length==0) {
        flashGang.members.push({
            id: userId,
            rank: "BOSS"
        })
    }
    const flashGangMember = {
        id: userId,
        flashGangId: flashGang.id,
        lastModified: flashGang.lastModified,
        rank: 'BOSS'
    }
    for (var i in flashGang.members) {
        let member = flashGang.members[i];
        flashGangMember.id=member.id;
        if (!flashGangMember.id || flashGangMember.id==''){
            continue
        }
        flashGangMember.rank = member.rank;
        flashGangMember.state = member.state;
        await putItem(flashGangMember, process.env.FLASHGANG_MEMBER_TABLE_NAME)
    }
    delete flashGang.members
    await putItem(flashGang, process.env.FLASHGANG_TABLE_NAME)
}

async function putItem(item, tableName) {
    var params = {
        TableName: tableName,
        Item: item
    };
    var documentClient = getDocumentDbClient();
    let updatedItem = await new Promise((resolve, reject) => {
        documentClient.put(params, function (err, data) {
            if (err) {
                console.log("putItem error ", params, err);
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
    var documentClient = getDocumentDbClient();
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

async function removeItem(id, tableName) {
    const ddb = getDBClient();
    var params = {
        TableName: tableName,
        Key: {
            'id': id
        }
    };
    var documentClient = getDocumentDbClient();
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