async function putItem(item, tableName) {
    console.log('tableName', tableName)
    let tempItem = getItem(item.id, tableName)
    if (tempItem){
        return await update(item, tableName)
    } else {
        return await insert(item, tableName)
    }
}

function getDBClient() {

    var AWS = require('aws-sdk');
    console.log("process.env.REGION", process.env.REGION);
    if (process.env.REGION) {
        AWS.config.update({ region: process.env.REGION });
    }
    var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    if (process.env.DYNAMODB_ENDPOINT && process.env.DYNAMODB_ENDPOINT != '') {
        ddb.endpoint = new AWS.Endpoint(process.env.DYNAMODB_ENDPOINT);
    }
    return ddb;
}

async function getItem(id, tableName) {
    const ddb = getDBClient();
    var params = {
        TableName: tableName,
        Key: {
            'id': { S: id }
        }
    };
    let item = await new Promise((resolve, reject) => {
        ddb.getItem(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                resolve(data.Item);
            }
        });
    });
    return mapToObject(item);
}

async function update(item, tableName) {
    const ddb = getDBClient();
    var dbItem = mapToDbUpdate(item);
    console.log("dbItem", dbItem)
    var params = {
        TableName: tableName,
        Key: {
            "id": { S: item.id }
        },
        UpdateExpression: dbItem.updateExpression,
        ExpressionAttributeValues: dbItem.expressionAttributeValues
    };

    let result = await new Promise((resolve, reject) => {
        ddb.updateItem(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                console.log("NOT error", data);
                resolve(data);
            }
        });
    }).then(data => {
        console.log("DONE updating", item);
        return item;
    }).catch(err => {
        console.log("ERROR updating", item);
        return;
    });
    return result;
}

async function insert(item, tableName) {
    const ddb = getDBClient();
    console.log("insert enter ");
    var dbItem = mapToDbItem(item);
    var params = {
        TableName: tableName,
        Item: dbItem,
        ReturnValues: 'ALL_OLD', // optional (NONE | ALL_OLD)
    };
    console.log("insert 2 ");
    let result = await new Promise((resolve, reject) => {
        ddb.putItem(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            } else {
                console.log("NOT error", data);
                resolve(data);
            }
        });
    }).then(data => {
        console.log("DONE inserting", item);
        return item;
    }).catch(err => {
        console.log("ERROR inserting", item);
        return;
    });
    console.log("item,", item, result);
    return result;
}

async function removeItem(id, tableName) {
    const ddb = getDBClient();
    var params = {
        TableName: tableName,
        Key: {
            'id': { S: id }
        }
    };
    let item = await new Promise((resolve, reject) => {
        ddb.deleteItem(params, function (err, data) {
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

function mapToObject(item) {
    const _object = {};
    for (key in item) {
        _attributeName = key;
        _attributeValue = item[key];
        _newKey = key;
        if (key.indexOf('_') > -1) {
            _newKey = '';
            _splitKey = key.split('_');
            for (i in _splitKey) {
                _segment = _splitKey[i];
                if (i > 0) {
                    _segment = _segment.substr(0, 1).toUpperCase() + _segment.substr(1);
                }
                _newKey += _segment;
            }
            _attributeName = _newKey;
        }
        _newValue = '';
        for (_type in _attributeValue) {
            _newValue = _attributeValue[_type];
        }
        _object[_newKey] = _newValue;
    }
    return _object;
}
function mapToDbItem(object) {

    if (typeof object != 'object') {
        object = JSON.parse(object);
    }
    const _item = {};
    for (key in object) {
        _attributeName = key;
        _attributeValue = object[key];
        if (!_attributeValue || _attributeValue + '' === '') {
            continue;
        }
        if (typeof _attributeValue == 'object') {
            console.log(_attributeName, "is an object - not persisting it");
            continue;
        }
        _newKey = '';
        for (i in _attributeName) {
            _c = _attributeName[i];
            if (i > 0 && _c == _c.toUpperCase()) {
                _c = '_' + _c.toLowerCase();
            }
            _newKey += _c;
        }
        _valueObject = { 'S': _attributeValue + '' };
        if (typeof _attributeValue == 'boolean') {
            _valueObject = { 'BOOL': _attributeValue };
        }
        _item[_newKey] = _valueObject;
    }
    console.log("item", _item);
    return _item;
}
function mapToDbUpdate(object) {
    dbItem = mapToDbItem(object);
    updateExpression = [];
    expressionAttributeValues = {};
    for (field in dbItem) {
        value = dbItem[field];
        if (field != 'id') {
            updateExpression.push(field + ' = :f' + field);
            expressionAttributeValues[':f' + field] = { 'S': value[Object.keys(value)[0]] }
        }
    }
    dbItem.updateExpression = "SET " + updateExpression.join();
    dbItem.expressionAttributeValues = expressionAttributeValues;
    return dbItem;
}

module.exports = {
    putItem,
    removeItem,
    getItem
}