const { generateNewPair } = require('./tokenutility')

const AWS = require('aws-sdk');

async function hasFlashGangPermissions(gangId, userId) {
    let flashGang = await getFlashGang(gangId)
    const permissions = { create: false, update: false, delete: false };
    if (!flashGang) {
        permissions.create = true;
        permissions.update = true;
        permissions.delete = true;
        return permissions;
    }
    let permitted = await flashGang.members.filter(member => {
        return member.id = userId && (member.rank == 'BOSS') && (member.state != 'INVITED' && member.state != 'TO_INVITE')
    })
    if (permitted.length > 0) {
        permissions.create = true;
        permissions.update = true;
        permissions.delete = true;
    } else {
        permitted = await flashGang.members.filter(member => {
            return member.id = userId && (member.rank == 'LIEUTENANT') && (member.state != 'INVITED' && member.state != 'TO_INVITE')
        })
        if (permitted.length > 0) {
            permissions.create = true;
            permissions.update = true;
        }
    }
    return permissions;
}
async function hasFlashDeckPermissions(deckId, userId) {
    const permissions = { create: false, update: false, delete: false }
    let flashDeck = await getFlashDeck(deckId);
    //If there's no flashDeck with this ID then no problem - it's a new FlashDeck
    if (!flashDeck) {
        permissions.create = true;
        permissions.update = true;
    } else if (flashDeck.owner == userId) {
        //If the flashDeck owner is the user, also no problem
        permissions.create = true;
        permissions.update = true;
        permissions.delete = true;
    } else if (!flashDeck.editable) {
        //all permissions are already false
    } else {
        //If the user is a BOSS or LIEUTENANT in any gang that contains this deck, and the deck is editable,
        //then the user can edit this deck (but not delete it)
        let gangs = await getGangsForDeck(deckId);
        for (var i in gangs) {
            let gang = gangs[i];
            let gangPermissions = await hasFlashGangPermissions(gang.id, userId);
            permissions.create ? permissions.create : gangPermissions.create;
            permissions.update ? permissions.update : gangPermissions.update;
            if (permissions.create && permissions.update) {
                break;
            }
        }
    }


    return permissions
}

async function countFlashDecks(userId) {
    const params = {
        TableName: process.env.FLASHDECK_TABLE_NAME,
        KeyConditionExpression: '#o = :uid',
        ExpressionAttributeNames: {
            '#o': 'owner'
        },
        IndexName: 'owner_index',
        ExpressionAttributeValues: {
            ':uid': userId
        },
        Select: 'COUNT'
    }
    console.log('countFlashDecks params', params)
    var documentClient = getDocumentDbClient();
    let count = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log('countFlashDecks err', err);
                resolve();
            } else {
                console.log('countFlashDecks data', data);
                resolve(data.Count)
            }
        });
    })
    console.log('countFlashDecks count', count)
    return count
}

async function countFlashGangs(userId) {
    const params = {
        TableName: process.env.FLASHGANG_TABLE_NAME,
        KeyConditionExpression: '#o = :uid',
        ExpressionAttributeNames: {
            '#o': 'owner'
        },
        IndexName: 'owner_index',
        ExpressionAttributeValues: {
            ':uid': userId
        },
        Select: 'COUNT'
    }
    console.log('countFlashGangs params', params)
    var documentClient = getDocumentDbClient();
    let count = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log('countFlashGangs err', err);
                resolve();
            } else {
                console.log('countFlashGangs data', data);
                resolve(data.Count)
            }
        });
    })
    console.log('countFlashGangs count', count)
    return count
}

async function getFlashDecks(userId, lastModifiedDate) {
    let currentUser = await getItem(userId, process.env.USER_TABLE_NAME);
    delete currentUser.password;
    currentUser.isCurrentUser = true;
    currentUser.profile = getProfile(currentUser.subscription);
    let totalDecks = await countFlashDecks(currentUser.id)
    let totalGangs = await countFlashGangs(currentUser.id)
    currentUser.remainingFlashDecksAllowed = currentUser.profile.maxDecks - totalDecks
    currentUser.remainingFlashGangsAllowed = currentUser.profile.maxGangs - totalGangs
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
    /*for (var i in userDecks) {
        //These decks belong to this user, so he's the boss
        //userDecks[i].rank = 'BOSS';
    }*/
    console.log("PHANTOMDECK BUG 1 ", userDecks);
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
    result.users.push(currentUser);
    for (var i in userGangs) {
        let userGang = userGangs[i];
        //let flashGang = await getItem(userGang.flashGangId, process.env.FLASHGANG_TABLE_NAME);
        let flashGang = await getFlashGang(userGang.flashGangId);
        flashGang.rank = userGang.rank;
        flashGang.state = userGang.state;
        
        if (userGang.invitedBy) {
            flashGang.invitedBy = await getItem(userGang.invitedBy, process.env.USER_TABLE_NAME);
            if (flashGang.invitedBy) {
                delete flashGang.invitedBy.password
            }
        }
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
        if (flashGang.owner == currentUser.id){
            flashGang.remainingMembersAllowed = currentUser.profile.maxMembersPerGang - flashGang.members.length
        }
        //put the members of this gang into the list of users, if it's not already there
        if (flashGang.members) {
            for (var j in flashGang.members) {
                let gangMember = flashGang.members[j];
                let existing = result.users.filter(gm => {
                    //TODO somehow there's an undefined member in this array
                    return gm && gm.id == gangMember.id
                });
                if (existing.length == 0) {
                    let gangster = await getItem(gangMember.id, process.env.USER_TABLE_NAME);
                    if (gangster) {
                        delete gangster.password;
                        result.users.push(gangster);
                    }
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
            let flashDeck = await getFlashDeck(userDeck.flashDeckId);
            flashDeck.rank = userDeck.rank;
            flashDeck.state = userDeck.state;
            let totalCards = 0
            if (flashDeck.flashCards) {
                totalCards = flashDeck.flashCards.length
            }
            flashDeck.remainingCardsAllowed = currentUser.profile.maxCardsPerDeck - totalCards
            result.flashDecks.push(flashDeck);
        }
    }
    for (var i in result.users) {
        var _user = result.users[i]
        console.log('result.users', result.users)
        _user.scores = []
        for (var j in result.flashDecks) {
            var _deck = result.flashDecks[j]
            let _userDeck = await getUserDeck(_deck.id, _user.id)
            console.log('_user', _user, '_deck', _deck, '_userDeck', _userDeck)
            _user.scores.push(_userDeck)
        }
    }

    return result;
}
const subscriptionLevels = {
    none: {
        maxDecks: 5,
        maxCardsPerDeck: 20,
        maxGangs: 2,
        maxMembersPerGang: 5
    },
    associate: {
        maxDecks: 15,
        maxCardsPerDeck: 99,
        maxGangs: 5,
        maxMembersPerGang: 10
    },
    admin: {
        maxDecks: 99,
        maxCardsPerDeck: 199,
        maxGangs: 30,
        maxMembersPerGang: 99
    },
    superadmin: {
        maxDecks: -1,
        maxCardsPerDeck: -1,
        maxGangs: -1,
        maxMembersPerGang: -1
    }
}
function getProfile(subscriptionLevel) {
    let profile = subscriptionLevels[subscriptionLevel];
    if (!profile) {
        profile = subscriptionLevels.none;
    }
    return profile;
}
async function getFlashGang(id) {
    let flashGang = await getItem(id, process.env.FLASHGANG_TABLE_NAME);
    console.log('flashGang dynamofordummies', flashGang)
    if (!flashGang) {
        return null
    }
    //query the gang-member table for members
    var params = {
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

    params = {
        TableName: process.env.FLASHGANG_DECK_TABLE_NAME,
        KeyConditionExpression: 'flashGangId = :id',
        IndexName: 'gang_index',
        ExpressionAttributeValues: {
            ':id': id
        }
    }
    let theDecks = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log("Failed to get flashgang decks from DB", err);
                resolve();
            } else {
                resolve(data.Items)
            }
        });
    })
    flashGang.flashDecks = []
    for (var i in theDecks) {
        flashGang.flashDecks.push(theDecks[i].id)
    }
    console.log('flashGang.flashDecks', flashGang.flashDecks)
    return flashGang;
}
async function getFlashDeck(id) {
    let deck = await getItem(id, process.env.FLASHDECK_TABLE_NAME);
    return deck;
}

async function removeFlashGangMember(id, flashGangId) {
    const params = {
        TableName: process.env.FLASHGANG_MEMBER_TABLE_NAME,
        Key: {
            flashGangId: flashGangId,
            id: id
        }
    }
    var documentClient = getDocumentDbClient();
    let result = await new Promise((resolve, reject) => {
        documentClient.delete(params, function (err, data) {
            if (err) {
                console.log("Failed to delete flashgang member", err);
                resolve();
            } else {
                console.log("Deleted flashgang member", err);
                resolve(data)
            }
        });
    })
    return result;

}
async function getGangsForDeck(id) {
    var params = {
        TableName: process.env.FLASHGANG_DECK_TABLE_NAME,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': id
        }
    }
    var documentClient = getDocumentDbClient();
    let result = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log("Failed to find flashgang deck", err);
                resolve();
            } else {
                console.log("Found flashgang deck", data);
                resolve(data.Items)
            }
        });
    })
    let gangs;
    if (result && Array.isArray(result)) {
        gangs = [];
        for (var i in result) {
            let gang = await getFlashGang(result[i].flashGangId);
            gangs.push(gang);
        }
    }
    return gangs;
}
async function removeDeckFromGangs(id) {
    let gangs = await getGangsForDeck(id);
    if (gangs) {
        let params = {
            TableName: process.env.FLASHGANG_DECK_TABLE_NAME,
            Key: {
                id: id
            }
        };
        for (var i in gangs) {
            params.Key.flashGangId = gangs[i].id;
            let deleted = await deleteByParams(params)
            console.log("deleted deck from gang", params, deleted);
        }
    }
    return gangs ? gangs.length : 0;
}

async function removeDeckFromUsers(id) {
    var params = {
        TableName: process.env.FLASHDECK_USER_TABLE_NAME,
        KeyConditionExpression: 'flashDeckId = :id',
        IndexName: 'flashdeck_index',
        ExpressionAttributeValues: {
            ':id': id
        }
    }
    var documentClient = getDocumentDbClient();
    let result = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log("Failed to find user deck", err);
                resolve();
            } else {
                console.log("Found user deck", data);
                resolve(data.Items)
            }
        });
    })
    if (result && Array.isArray(result)) {
        params = {
            TableName: process.env.FLASHDECK_USER_TABLE_NAME,
            Key: {
                flashDeckId: id
            }
        };
        for (var i in result) {
            params.Key.userId = result[i].userId;
            let deleted = await deleteByParams(params)
            console.log("deleted deck from user", params, deleted);
        }
    }
    return result;
}

async function removeDecksFromGang(id) {
    var params = {
        TableName: process.env.FLASHGANG_DECK_TABLE_NAME,
        KeyConditionExpression: 'flashGangId = :id',
        IndexName: 'gang_index',
        ExpressionAttributeValues: {
            ':id': id
        }
    }
    var documentClient = getDocumentDbClient();
    let result = await new Promise((resolve, reject) => {
        documentClient.query(params, function (err, data) {
            if (err) {
                console.log("Failed to find gang decks", err);
                resolve();
            } else {
                console.log("Found gang decks", data);
                resolve(data.Items)
            }
        });
    })
    if (result && Array.isArray(result)) {
        params = {
            TableName: process.env.FLASHGANG_DECK_TABLE_NAME,
            Key: {
                flashGangId: id
            }
        };
        for (var i in result) {
            params.Key.id = result[i].id;
            let deleted = await deleteByParams(params)
            console.log("deleted deck from gang", params, deleted);
        }
    }
    return result;
}
async function deleteByParams(params) {
    var documentClient = getDocumentDbClient();
    let result = await new Promise((resolve, reject) => {
        documentClient.delete(params, function (err, data) {
            if (err) {
                reject(err)
            }
            else {
                resolve(data);
            }
        });
    })
    return result;
}

async function putFlashDeck(flashDeck, userId) {
    let now = new Date();
    flashDeck.lastModified = now.getTime();
    let currentFlashDeck = await getFlashDeck(flashDeck.id);
    if (currentFlashDeck) {
        //The owner can't be changed
        flashDeck.owner = currentFlashDeck.owner;
        //Only the owner can change the editability
        if (flashDeck.owner != userId) {
            flashDeck.editable = currentFlashDeck.editable
        }
    } else {
        flashDeck.owner = userId;
    }
    //Just setting it explicitely, in case the user didn't set it.
    if (!flashDeck.editable) {
        flashDeck.editable = false;
    }
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
    //Get the flashgang first, to make sure that the boss isn't being changed
    let currentGang = await getFlashGang(flashGang.id);
    if (currentGang) {
        flashGang.owner = currentGang.owner
        //TODO - compare the current gang members
        //to the new list - delete all who aren't boss (they'll be re-inserted below)
        //Don't add the boss record if it already exists (it must exist, in fact, if
        //the gang exists)
    } else {
        flashGang.owner = userId
    }
    if (!flashGang.members) {
        flashGang.members = []
    }
    let existing = flashGang.members.filter(member => {
        return member.id == userId;
    })
    if (existing.length == 0) {
        flashGang.members.push({
            id: userId,
            rank: "BOSS"
        })
    }
    const flashGangMember = {
        id: userId,
        flashGangId: flashGang.id,
        lastModified: flashGang.lastModified
    }
    for (var i in flashGang.members) {
        let member = flashGang.members[i];
        flashGangMember.id = member.id;
        if (!flashGangMember.id || flashGangMember.id == '') {
            continue
        }
        flashGangMember.rank = member.rank;
        flashGangMember.state = member.state;
        flashGangMember.invitedBy = member.invitedBy;
        await putItem(flashGangMember, process.env.FLASHGANG_MEMBER_TABLE_NAME)
    }
    //delete all existing relationships between gangs and decks
    await removeDecksFromGang(flashGang.id)
    //and then add them back in again.
    const flashGangDeck = {
        flashGangId: flashGang.id
    }
    if (flashGang.flashDecks) {
        for (var i in flashGang.flashDecks) {
            let deck = flashGang.flashDecks[i];
            flashGangDeck.id = deck;
            await putItem(flashGangDeck, process.env.FLASHGANG_DECK_TABLE_NAME)
        }
    }
    delete flashGang.members
    delete flashGang.flashDecks
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
    var params = {
        TableName: tableName,
        Key: {
            'id': id
        }
    };
    var documentClient = getDocumentDbClient();
    let item = await new Promise((resolve, reject) => {
        documentClient.delete(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                console.log("success deleting", id);
                resolve(data);
            }
        });
    });
    return item;
}

async function deleteFlashDeck(id) {
    await removeItem(id, process.env.FLASHDECK_TABLE_NAME)
    await removeDeckFromGangs(id)
    await removeDeckFromUsers(id)
}
async function deleteFlashGang(id) {
    await removeDeckFromUsers(id);
    let currentGang = await getFlashGang(flashGang.id);
    if (currentGang.members) {
        for (var i in currentGang.members) {
            await removeFlashGangMember(currentGang.members[i].id, id);
        }
    }
    await removeItem(id, process.env.FLASHGANG_TABLE_NAME);
}
async function getUser(id) {
    let user = await getItem(id, process.env.USER_TABLE_NAME);
    if (user) {
        user.profile = getProfile(user.subscription);
    }
    return user;
}
//score = { flashDeckId: flashDeck.id, score: percentage, time: flashDeck.time, highScore: percentage }
async function saveScores(scores, userId) {
    console.log('DDB4Dummies saveScores', scores, 'UserID', userId)
    var documentClient = getDocumentDbClient();
    for (var i in scores) {
        var _score = scores[i]
        let item = await getUserDeck(_score.flashDeckId, userId)
        if (!item) {
            item = _score
            item.userId = userId
        } else {
            if (!item.highScore || item.highScore < _score.highScore) {
                item.highScore = _score.highScore
            }
            item.score = _score.score
            item.time = _score.time
        }
        await putItem(item, process.env.FLASHDECK_USER_TABLE_NAME)
    }
}

async function getUserDeck(flashDeckId, userId) {
    var documentClient = getDocumentDbClient();
    var params = {
        TableName: process.env.FLASHDECK_USER_TABLE_NAME,
        Key: {
            'userId': userId,
            'flashDeckId': flashDeckId
        }
    };
    let item = await new Promise((resolve, reject) => {
        documentClient.get(params, function (err, data) {
            if (err) {
                console.log("Error getting flashdeck/user table", err);
                reject(err);
            } else {
                console.log("success getting flashdeck/user table");
                resolve(data.Item);
            }
        });
    });
    console.log('getUserDeck item', item)
    if (item && item.flashDeckId) {
        return item
    }
    else return null
}

module.exports = {
    putItem,
    removeItem,
    getItem,
    getFlashDecks,
    putFlashDeck,
    putFlashGang,
    removeFlashGangMember,
    hasFlashGangPermissions,
    getFlashGang,
    deleteFlashDeck,
    hasFlashDeckPermissions,
    deleteFlashGang,
    getUser,
    saveScores,
    countFlashDecks,
    countFlashGangs
}