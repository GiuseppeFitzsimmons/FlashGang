const bcrypt = require('bcryptjs');
const dynamodbfordummies = require('dynamofordummies');
const tokenUtility = require('tokenutility');
const mailUtility = require('mailutility')
const fs = require('fs');
const uuidv4 = require('uuid/v4');
var AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    var reply = {}
    if (typeof event.body === 'string') {
        event.body = JSON.parse(event.body)
    }
    let returnObject = {}
    returnObject.statusCode = 200;
    var token;
    try {
        token = tokenUtility.validateToken(event)
    } catch (badtoken) {
        console.log("BADTOKEN", badtoken)
        reply=badtoken;
        returnObject.statusCode=badtoken.statusCode;
    }
    if (token) {
        console.log('GalleryLambda line 25 called')
        if (event.httpMethod.toLowerCase() === 'post') {
            {
                if (event.body.source) {
                    if (event.body.source.indexOf('data:image') == 0) {
                        var imageData = event.body.source.split(',');
                        var base64Data = imageData[1];
                        var imageType = imageData[0].toLowerCase().replace("data:image/", '').replace(';base64', '');
                        var subPath = `/images/${uuidv4()}.${imageType}`
                        var path = `${process.env.IMAGE_PREFIX}${subPath}`
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
                            await dynamodbfordummies.putImage(token.sub, reply.url)
                        }
                        console.log("s3result", s3result);
                    }
                }
                //await dynamodbfordummies.putItem(user, process.env.IMAGE_TABLE)
                //reply.user = await dynamodbfordummies.getUser(user.id)
    
            }
        } else if (event.httpMethod.toLowerCase() === 'get') {
            let images = await dynamodbfordummies.getImages(token.sub)
            reply = {images}
        }
    }
    returnObject.body = JSON.stringify(reply);
    returnObject.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,HEAD,GET,PUT,POST"
    }
    console.log("GalleryLambda ", returnObject);
    return returnObject
}