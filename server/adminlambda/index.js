const dynamodbfordummies = require('dynamofordummies');
const tokenUtility = require('tokenutility');
var AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    var reply = {}
    if (typeof event.body === 'string') {
        event.body = JSON.parse(event.body)
    }
    let returnObject = {}
    returnObject.statusCode = 200;
    let _body = {}
    var token;
    let _event = JSON.stringify(event)
    console.log('adminlambda _event', _event)
    /*try {
        token = tokenUtility.validateToken(event)
    } catch (badtoken) {
        console.log("BADTOKEN", badtoken)
        reply = badtoken;
        returnObject.statusCode = badtoken.statusCode;
    }
    if (token) {*/
    if (event.httpMethod.toLowerCase() === 'get') {
        {
            var users = await dynamodbfordummies.getAllUsers(event.queryStringParameters)
            console.log('adminlambda users', users.Items)
            _body.users = []
            var filteredUsers = []
            for (var i in users.Items) {
                let user = users.Items[i]
                let filteredUser = {}
                filteredUser.firstName = user.firstName
                filteredUser.lastName = user.lastName
                filteredUser.id = user.id
                if (user.subscription) {
                    filteredUser.subscription = user.subscription
                } else {
                    filteredUser.subscription = 'member'
                }
                filteredUsers.push(filteredUser)
            }
            if (users.LastEvaluatedKey) {
                _body.LastEvaluatedKey = users.LastEvaluatedKey
            }
            _body.users = filteredUsers
            returnObject.body = JSON.stringify(_body)
            /*if (event.body.source) {
                if (event.body.source.indexOf('data:image') == 0) {
                    var imageData = event.body.source.split(',');
                    var base64Data = imageData[1];
                    var imageType = imageData[0].toLowerCase().replace("data:image/", '').replace(';base64', '');
                    var subPath = `/images/${token.sub}/${uuidv4()}.${imageType}`
                    var path = `${process.env.IMAGE_PREFIX}${subPath}`
                    var s3 = gets3()
                    var bucketParams = {
                        Body: new Buffer(base64Data, 'base64'),
                        Bucket: process.env.IMAGE_BUCKET,
                        Key: path,
                        ContentEncoding: 'base64',
                        ContentType: `image/${imageType}`
                    };
                    //fs.writeFileSync('avatartest.jpg',base64Data, 'base64');
                    let s3result = await new Promise((resolve, reject) => {
                        s3.putObject(bucketParams, function (err, data) {
                            if (err) {
                                console.log("Error uploading IMAGE", err, err.stack);
                                reject(err);
                            } else {
                                console.log("Success uploading IMAGE", data);
                                resolve(data);
                            }
                        });
                    })
                    if (s3result.ETag) {
                        //TODO at some point in the future we should have a way that cleans up unused images.
                        reply.url = `https://${process.env.S3_SERVER_DOMAIN}${subPath}`
                        //await dynamodbfordummies.putImage(token.sub, reply.url)
                    }
                    console.log("s3result", s3result);
                }
            }*/
        }
    } else if (event.httpMethod.toLowerCase() === 'post')
        {
        var user = await dynamodbfordummies.saveUser(event.queryStringParameters)
        console.log('adminlambda saveUser', user)
    }
    //returnObject.body = JSON.stringify(reply);
    returnObject.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,HEAD,GET,PUT,POST"
    }
    console.log("AdminLambda ", returnObject);
    return returnObject
}

/*function gets3() {
    var s3Config = {};
    if (process.env.S3_ENDPOINT && process.env.S3_ENDPOINT != '') {
        s3Config.endpoint = process.env.S3_ENDPOINT;
    }
    if (process.env.REGION && process.env.REGION != '') {
        s3Config.region = process.env.REGION;
    }
    if (process.env.ACCESS_KEY_ID && process.env.ACCESS_KEY_ID != '' && process.env.ACCESS_KEY_ID != '::') {
        s3Config.accessKeyId = process.env.ACCESS_KEY_ID,
            s3Config.secretAccessKey = process.env.SECRET_ACCESS_KEY
    }
    console.log('s3Config', s3Config)
    var s3 = new AWS.S3(s3Config);
    return s3
}*/