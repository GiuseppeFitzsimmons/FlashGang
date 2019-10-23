const fetch=require('node-fetch')

const createAccountTony = {
    id: 'tony@soprano.id',
    firstName: 'Tony',
    lastName: 'Soprano',
    password: 'password'
}
const createAccountChris = {
    id: 'chris@soprano.id',
    firstName: 'Chris',
    lastName: 'Soprano',
    password: 'password'
}
synchroniseTony = {
    "flashDecks": [
        {
            "id": "10",
            "name": "The name of the deck",
            "flashCards": [
                {
                    "id": "11",
                    "question": "How much?",
                    "correctAnswers": [
                        "a lot"
                    ]
                }
            ]
        }
    ],
    "flashGangs": [
        {
            "id": "11",
            "name": "My gang",
            "description": "My homies studying the multiplication tables",
            "members": [
                {
                    "id": "chris@soprano.id",
                    "state": "TO_INVITE",
                    "rank": "SOTTOCAPPO"
                }
            ],
            "flashDecks": ["10"]
        }
    ]
}
synchroniseChris = {

}


async function post(url, params, token) {
    var _headers = {}
    if (token) {
        _headers.authorization = token;
    }
    let reply = await fetch(url, {
        method: 'post',
        credentials: "same-origin",
        headers: _headers,
        body: JSON.stringify(params)
    })
        .then(function (response) {
            responseCode = response.status;
            return response.json();

        })
        .then(function (json) {
            //console.log("REPLY FROM POST", json);
            return json
        })
        .catch(function (err) {
            responseCode = 0
            console.log('postToServer error', err)
            return {}
        })
    return reply
}

async function test() {
    console.log("CREATING ACCOUNT TONY");
    let tony=await post('http://localhost:8080/account', createAccountTony);
    console.log(tony);
    if (!tony || !tony.token) {
        createAccountTony.grant_type="password";
        tony=await post('http://localhost:8080/login', createAccountTony);
    }
    console.log(tony);
    console.log("SYNCHRONISING TONY");
    let tonySynch=await post('http://localhost:8080/synchronise', synchroniseTony, tony.token);
    console.log(tonySynch);
    console.log("CREATING ACCOUNT CHRIS");
    let chris=await post('http://localhost:8080/account', createAccountChris);
    console.log(chris);
    if (!chris || !chris.token) {
        createAccountChris.grant_type="password";
        chris=await post('http://localhost:8080/login', createAccountChris);
    }
    console.log(chris);
    console.log("SYNCHRONISING CHRIS");
    let chrisSynch=await post('http://localhost:8080/synchronise', synchroniseChris, chris.token);
    console.log(chrisSynch);
}

test();