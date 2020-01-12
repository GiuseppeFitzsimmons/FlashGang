const fetch=require('node-fetch')
//const domain='https://api.flashgang.io/v1'
const domain='http://localhost:8080';

const createAccountTony = {
    id: 'tony@soprano.it',
    firstName: 'Tony',
    lastName: 'Soprano',
    password: 'password',
    subscription: 'boss'
}
const createAccountChris = {
    id: 'chris@soprano.it',
    firstName: 'Chris',
    lastName: 'Moltisanti',
    password: 'password',
    subscription: 'lieutenant'
}
const createAccountCarmella = {
    id: 'carmella@soprano.it',
    firstName: 'Carmella',
    lastName: 'Soprano',
    password: 'password',
    subscription: 'member'
}
const createAccountJunior = {
    id: 'junior@soprano.it',
    firstName: 'Junior',
    lastName: 'Soprano',
    password: 'password'
}
const createAccountPaulie = {
    id: 'paulie@soprano.it',
    firstName: 'Paulie',
    lastName: 'Gualtieri',
    nickName: 'Wallnuts',
    password: 'password',
    subscription: 'lieutenant'
}
const createAccountBobby = {
    id: 'bobby@soprano.it',
    firstName: 'Bobby',
    lastName: 'Baccalieri',
    nickName: 'Bacala',
    password: 'password'
}
const createAccountVito = {
    id: 'vito@soprano.it',
    firstName: 'Vito',
    lastName: 'Spatafore',
    password: 'password'
}
const createAccountJohnny = {
    id: 'johnny@soprano.it',
    firstName: 'Johnny',
    lastName: 'Sacramoni',
    nickName: 'Sack',
    password: 'password'
}
const createAccountPhil = {
    id: 'phil@soprano.it',
    firstName: 'Phil',
    lastName: 'Leotardo',
    password: 'password'
}
const createAccountLivia = {
    id: 'mom@soprano.it',
    firstName: 'Livia',
    lastName: 'Soprano',
    nickName: 'Mom',
    password: 'password'
}
const createAccountSal = {
    id: 'salvatore@soprano.it',
    firstName: 'Salvatore',
    lastName: 'Bonpensiero',
    nickName: 'Big Pussy',
    password: 'password'
}
const createAccountAngelo = {
    id: 'angelo@soprano.it',
    firstName: 'Angelo',
    lastName: 'Garepi',
    password: 'password'
}
const createAccountCarmine = {
    id: 'carmine@soprano.it',
    firstName: 'Carmine',
    lastName: 'Lupertazzi Jr',
    password: 'password'
}
const createAccountMikey = {
    id: 'mikey@soprano.it',
    firstName: 'Mikey',
    lastName: 'Palmice',
    password: 'password'
}
const castOfSopranos=[createAccountCarmella, createAccountJunior, createAccountPaulie, 
    createAccountBobby, createAccountVito, createAccountJohnny, 
    createAccountPhil, createAccountLivia, createAccountSal,
    createAccountCarmine, createAccountMikey, createAccountAngelo]
synchroniseTony = {
    "flashDecks": [
        {
            "id": "10",
            "name": "The name of the deck",
            "editable":"true",
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
                    "rank": "LIEUTENANT"
                }
            ],
            "flashDecks": ["10"]
        }
    ]
}

deleteDeckTony = {
    "deletions": {
        "flashDecks": [
            { "id": "10" }
        ]
    }
}
rsvpChris = {
    flashGangId: '11',
    acceptance: true
}
synchroniseChris = {
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
                    },

                    {
                        "id": "12",
                        "question": "Ow olda you boy?",
                        "correctAnswers": [
                            "aaaaaaa!"
                        ]
                    }
                ]
            }
        ]
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
async function get(url, token) {
    var _headers = {}
    if (token) {
        _headers.authorization = token;
    }
    let reply = await fetch(url, {
        method: 'get',
        credentials: "same-origin",
        headers: _headers
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
            console.log('getFromServer error', err)
            return {}
        })
    return reply
}

async function test() {
    console.log("CREATING ACCOUNT TONY");
    let tony=await post(domain+'/account', createAccountTony);
    console.log(tony);
    if (!tony || !tony.token) {
        createAccountTony.grant_type="password";
        tony=await post(domain+'/login', createAccountTony);
    }
    console.log(tony);
    console.log("SYNCHRONISING TONY");
    let tonySynch=await post(domain+'/synchronise', synchroniseTony, tony.token);
    console.log(tonySynch);
    console.log("CREATING ACCOUNT CHRIS");
    let chris=await post(domain+'/account', createAccountChris);
    console.log(chris);
    if (!chris || !chris.token) {
        createAccountChris.grant_type="password";
        chris=await post(domain+'/login', createAccountChris);
    }
    console.log(chris);;
    console.log("RSVP CHRIS");
    let chrisRsvp=await post(domain+'/rsvp', rsvpChris, chris.token);
    console.log(JSON.stringify(chrisRsvp));
    console.log("SYNCHRONISING CHRIS");
    let chrisSynch=await post(domain+'/synchronise', synchroniseChris, chris.token);
    console.log(JSON.stringify(chrisSynch));
    //console.log("DELETING A DECK TONY");
    //let tonyDeleteDeck=await post(domain+'/synchronise', deleteDeckTony, tony.token);
    //console.log(tonyDeleteDeck);
    for (var i in castOfSopranos) {
        let createCastMembmer=await post(domain+'/account', castOfSopranos[i]);
    }
    
}

function run() {
    let testArg=process.argv[2];
    if (testArg=='users') {
        testGetAllUsers();
    } else {
        test();
    }
}
run();
async function testGetAllUsers() {
    console.log("test")
    let getAll=await get(domain+'/admin?subscription=member');
    console.log("all users",getAll);
}