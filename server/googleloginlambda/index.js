const axios = require('axios');
const qs = require('qs');
const dynamodbfordummies = require('dynamofordummies');
const tokenUtility = require('tokenutility');

exports.handler = async (event, context) => {
    console.log("Google Login Lambda event body", event);
    const code = event.queryStringParameters.code
    const scope = event.queryStringParameters.scope
    if (code) {
        let result = await new Promise((resolve, reject) => {
            const data = {
                code: code,
                client_id: '979434939914-mmo8birn7i0okdb888crfjej7mpj1q66.apps.googleusercontent.com',
                client_secret: 'Hlo9f_fz4OEvvifG3WOWvonF',
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost:8080/googleauth'
            }
            const options = {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify(data),
                url: 'https://www.googleapis.com/oauth2/v4/token/'
            }
            console.log('options', options)
            axios(options).then(response => {
                console.log('response', response)
                resolve(response)
            }).catch(error => {
                console.log('error', error)
                reject(error)
            })
        })
        console.log('result.data', result.data)
        if (result.data.access_token) {
            const access_token = result.data.access_token
            let profileResult = await new Promise((resolve, reject) => {
                const profileOptions = {
                    method: 'GET',
                    headers: { 'authorization': 'Bearer ' + access_token },
                    url: 'https://www.googleapis.com/oauth2/v3/userinfo'
                }
                axios(profileOptions).then(response => {
                    console.log('response', response)
                    resolve(response)
                }).catch(error => {
                    console.log('error', error)
                    reject(error)
                })
            })
            if (profileResult.data.email) {
                let user = await dynamodbfordummies.getUser(profileResult.data.email)
                if (!user) {
                    user = {
                        id: profileResult.data.email,
                        firstName: profileResult.data.given_name,
                        lastName: profileResult.data.family_name,
                        picture: profileResult.data.picture,
                        nickname: profileResult.data.name
                    }
                } else {
                    if (!user.firstName || user.firstName==='') {
                        user.firstName = profileResult.data.given_name
                    }
                    if (!user.lastName || user.lastName==='') {
                        user.lastName = profileResult.data.family_name
                    }
                    if (!user.picture || user.picture==='') {
                        user.picture = profileResult.data.picture
                    }
                    if (!user.nickname || user.nickname==='') {
                        user.nickname = profileResult.data.nickname
                    }
                }
                await dynamodbfordummies.putItem(user, process.env.USER_TABLE_NAME)
                user = await dynamodbfordummies.getUser(user.id)
                let tokenPair = tokenUtility.generateNewPair(user.id, 'all')
                const reply = {
                    statusCode: 302,
                    headers: {
                        location: 'http://localhost:3000',
                        'set-cookie': 'socialLogin='+JSON.stringify({
                            jwt: tokenPair.signedJwt,
                            refresh: tokenPair.signedRefresh,
                            user: user
                        })
                    }
                }
                reply.body = '{}'
                return reply
            }
        }
    }
}