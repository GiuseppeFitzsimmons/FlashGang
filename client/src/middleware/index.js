import { SET_SCORE, SET_PASSWORD, RESET_PASSWORD, RSVP, LOADING, NEW_DECK, SAVE_DECK, NEXT_CARD, LOAD_DECKS, LOAD_FLASHDECK, SCORE_CARD, DELETE_DECK, DELETE_CARD, PREV_CARD, LOAD_GANGS, NEW_GANG, SAVE_GANG, LOAD_FLASHGANG, CREATE_ACCOUNT, LOGIN } from '../action'
import { doesNotReject } from 'assert';
import FuzzySet from 'fuzzyset.js';

const env = require('./environment.js');
const uuidv4 = require('uuid/v4');

async function synchronise() {
    console.log('Synchronisation')
    var questObject = {}
    questObject.params = {}
    var decks = []
    var gangs = []
    var scores = []
    var keys = Object.entries(localStorage)
    console.log("synchronise ", keys);
    for (var i = 0; i < localStorage.length; i++) {
        var key = keys[i];
        if (key[0].indexOf('flashDeck-') == 0) {
            decks.push(JSON.parse(localStorage.getItem(key[0])))
        } else if (key[0].indexOf('flashGang-') == 0) {
            gangs.push(JSON.parse(localStorage.getItem(key[0])))
        } else if (key[0].indexOf('score-') == 0) {
            scores.push(JSON.parse(localStorage.getItem(key[0])))
        }
    }
    questObject.params.flashDecks = decks
    questObject.params.flashGangs = gangs
    questObject.params.scores = scores
    questObject.params.deletions = {}
    questObject.params.deletions.flashDecks = []
    for (var i = 0; i < localStorage.length; i++) {
        var key = keys[i];
        if (key[0].indexOf('delete-flashDeck-') == 0) {
            questObject.params.deletions.flashDecks.push(JSON.parse(localStorage.getItem(key[0])))
        }
    }
    questObject.resource = 'synchronise'
    let postResult = await postToServer(questObject)
    if (postResult.flashDecks) {
        for (var i in postResult.flashDecks) {
            let _deck = postResult.flashDecks[i]
            localStorage.setItem('flashDeck-' + _deck.id, JSON.stringify(_deck))
        }
    }
    if (postResult.flashGangs) {
        for (var i in postResult.flashGangs) {
            let _gang = postResult.flashGangs[i]
            localStorage.setItem('flashGang-' + _gang.id, JSON.stringify(_gang))
        }
    }
    if (postResult.users) {
        for (var i in postResult.users) {
            let _user = postResult.users[i]
            localStorage.setItem('user-' + _user.id, JSON.stringify(_user))
            if (_user.isCurrentUser) {
                localStorage.setItem('currentUser', JSON.stringify(_user))
            }
        }
    }
    console.log('Synchronisation complete')
}

const restfulResources = { synchronise: '/synchronise', account: '/account', login: '/login', rsvp: '/rsvp', resetpw: '/resetpw', setpw: '/setpw' }

async function postToServer(questObject) {
    var environment = env.getEnvironment(window.location.origin);
    var restfulResource = questObject.resource;
    var params = questObject.params;
    var isFormData = false
    if (typeof (params) == 'object') {
        for (var _name in params) {
            var param = params[_name]
            if (param && param.type == 'file') {
                isFormData = true
                //break
            }
        }
        if (isFormData) {
            var data = new FormData()
            for (var _name in params) {
                var param = params[_name]
                console.log('paramandname', param, _name)
                if (param && param.type == 'file') {
                    data.append('file', param.files[0])
                } else {
                    data.append(_name, param)
                }
            }
            params = data
        } else {
            params = JSON.stringify(params)
        }
    }
    var token = localStorage.getItem('flashJwt')
    if (questObject.resource == 'setpw') {
        token = questObject.params.token
    }
    var responseCode = 0;
    var method = 'POST'
    if (questObject.update) {
        method = 'PUT'
    }
    var _headers = {}
    _headers.Authorization = token
    _headers.Accept = 'application/json, text/plain, */*'
    if (!isFormData) {
        _headers['Content-Type'] = 'application/json'
    }
    let reply = await fetch(environment.url + restfulResources[restfulResource], {
        method: method,
        credentials: "same-origin",
        headers: _headers,
        body: params
    })
        .then(function (response) {
            responseCode = response.status;
            return response.json();

        })
        .then(function (json) {
            console.log("REPLY FROM POST", json);
            return json
        })
        .catch(function (err) {
            responseCode = 0
            console.log('postToServer error', err)
            return {}
        })
    if (responseCode == 401 && reply.code === 'exp' && !questObject.retry) {
        //the token expired, refresh it and try again
        await refreshToken();
        questObject.retry = true;
        return await postToServer(questObject);
    }
    reply.responseCode = responseCode;
    console.log('server reply', reply)
    return reply
}

async function saveScore(flashDeck) {
    let score = localStorage.getItem('score-' + flashDeck.id)
    if (score) {
        score = JSON.parse(score)
    }
    let correctAnswers = 0
    let incorrectAnswers = 0
    let percentage = 0
    for (var i in flashDeck.flashCards) {
        let card = flashDeck.flashCards[i]
        if (card.correct) {
            correctAnswers++
        } else {
            incorrectAnswers++
        }
    }
    if (correctAnswers > 0) {
        percentage = (correctAnswers / flashDeck.flashCards.length) * 100
    }
    if (!score) {
        score = { flashDeckId: flashDeck.id, score: percentage, time: flashDeck.time, highScore: percentage }
    } else {
        if (score.percentage < percentage) {
            score.highScore = percentage
        }
        score.score = percentage
        score.time = flashDeck.time
    }
    localStorage.setItem('score-' + flashDeck.id, JSON.stringify(score))
}

async function getFromServer(questObject) {
    var environment = env.getEnvironment(window.location.origin);
    var restfulResource = questObject.resource;
    var params = questObject.params;
    var responseCode = 0;
    var token = localStorage.getItem('token');
    var _url = environment.url + restfulResources[restfulResource];
    if (params && params.id) {
        _url += '/' + params.id
    }
    let reply = await fetch(_url, {
        method: "GET",
        credentials: "same-origin", // send cookies
        headers: {
            'Authorization': token,
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    })
        .then(function (response) {
            responseCode = response.status;
            return response.json();

        })
        .then(function (json) {
            console.log("getFromServer then", json);
            return json
        })
    if (responseCode == 401 && reply.code === 'exp' && !questObject.retry) {
        await refreshToken();
        questObject.retry = true;
        return await getFromServer(questObject);
    } else {
        reply.responseCode = responseCode;
        return reply
    }
}

async function refreshToken() {
    var _refreshToken = localStorage.getItem('flashJwtRefresh');
    const params = {
        "grant_type": "refresh",
        "token": _refreshToken
    }
    var questObject = { resource: 'login', params: params };
    let refresh = await postToServer(questObject);
    if (refresh.responseCode != 200 && refresh.responseCode != 201) {
        console.log("failed to refresh token TODO clear the session, return to login")
    } else {
        console.log("token is refreshed, storing new tokens in session")
        localStorage.setItem('flashJwt', refresh.token)
        localStorage.setItem('flashJwtRefresh', refresh.refreshToken)
    }
    return refresh;

}

function scoreCard(deck) {
    console.log('deck', deck)
    if (!deck.hasOwnProperty('currentIndex')) {
        return
    }
    let card = deck.flashCards[deck.currentIndex]
    card.correct = true
    if (card.userAnswer && Array.isArray(card.userAnswer)) {
        const userAnswersSorted = card.userAnswer.sort()
        const correctAnswersSorted = card.correctAnswers.sort()
        if (JSON.stringify(userAnswersSorted) != JSON.stringify(correctAnswersSorted)) {
            card.correct = false
        }
    } else if (!card.userAnswer || card.userAnswer == '') {
        card.correct = false
    } else {
        let fuzzyAnswer = FuzzySet([card.correctAnswers[0]])
        let fuzzyAnswered = fuzzyAnswer.get(card.userAnswer)
        let fuzziness = 0
        let deckFuzziness = deck.fuzziness ? deck.fuzziness : 1
        if (fuzzyAnswered && fuzzyAnswered[0]) {
            if (fuzzyAnswered[0][0]) {
                fuzziness = fuzzyAnswered[0][0]
            }
        }
        let invertedFuzziness = 10 - (fuzziness * 10)
        if (invertedFuzziness > deckFuzziness) {
            card.correct = false
        }
    }
}
function selectNextCard(deck) {
    const answerType = deck.answerType
    const testType = deck.testType
    if (testType == 'EXAM') {
        if (!deck.hasOwnProperty('currentIndex')) {
            deck.currentIndex = -1;
            deck.startTime = new Date().getTime()
        }
        if (deck.currentIndex + 1 >= deck.flashCards.length) {
            deck.mode = 'COMPLETE'
        } else {
            deck.currentIndex++
        }
    } else if (testType == 'REVISION') {
        if (!deck.hasOwnProperty('currentIndex')) {
            deck.startTime = new Date().getTime()
        }
        let unansweredCards = []
        for (var i in deck.flashCards) {
            let card = deck.flashCards[i]
            if (!card.hasOwnProperty('correct')) {
                unansweredCards.push(i)
            }
        }
        if (unansweredCards.length == 0) {
            deck.mode = 'COMPLETE'
        } else {
            deck.currentIndex = unansweredCards[Math.floor(Math.random() * Math.floor(unansweredCards.length))]
        }
    } else if (testType == 'CRAM') {
        if (!deck.hasOwnProperty('currentIndex')) {
            deck.startTime = new Date().getTime()
        }
        let unansweredCards = []
        for (var i in deck.flashCards) {
            let card = deck.flashCards[i]
            if (!card.correct) {
                unansweredCards.push(i)
                delete card.correct;
            }
        }
        if (unansweredCards.length == 0) {
            deck.mode = 'COMPLETE'
        } else {
            deck.currentIndex = unansweredCards[Math.floor(Math.random() * Math.floor(unansweredCards.length))]
        }
    }
    if (answerType == 'MULTIPLE') {
        let card = deck.flashCards[deck.currentIndex]
        card.multipleChoices = []
        if (card.correctAnswers && card.incorrectAnswers) {
            card.multipleChoices = [...card.correctAnswers, ...card.incorrectAnswers]
        } else if (card.correctAnswers) {
            card.multipleChoices = [...card.correctAnswers]
        } if (card.multipleChoices.length >= 5) {

        } else {
            let answers = []
            for (var i in deck.flashCards) {
                if (i != deck.currentIndex) {
                    let goodAnswers = deck.flashCards[i]
                    answers = [...answers, ...goodAnswers.correctAnswers]
                    if (goodAnswers.incorrectAnswers) {
                        answers = [...answers, ...goodAnswers.incorrectAnswers]
                    }
                }
            }
            while (card.multipleChoices.length < 5) {
                let answerIndex = Math.floor(Math.random() * Math.floor(answers.length))
                let anAnswer = answers[answerIndex]
                answers.splice(answerIndex, 1)
                card.multipleChoices.push(anAnswer)
                if (answers.length == 0) {
                    break
                }
            }
            card.multipleChoices = card.multipleChoices.sort((a, b) => {
                return Math.floor(Math.random() * Math.floor(3)) - 1
            })
        }
    }
    if (deck.mode == 'COMPLETE') {
        deck.time = new Date().getTime() - deck.startTime
        console.log({ deck })
        saveScore(deck);
        synchronise();
    }
}
export function flashGangMiddleware({ dispatch }) {
    return function (next) {
        return async function (action) {
            if (action.type === NEW_DECK) {
                console.log('Middleware NEW_DECK')
                action.data.flashDeck = { mode: 'EDIT' }
            } else if (action.type === NEW_GANG) {
                console.log('Middleware NEW_GANG')
                action.flashGang = {}
            }
            else if (action.type === SAVE_DECK) {
                console.log('Middleware SAVE_DECK')
                if (!action.data.flashDeck.id) {
                    action.data.flashDeck.id = uuidv4()
                }
                var mode = action.data.flashDeck.mode
                delete action.data.flashDeck.dirty
                delete action.data.flashDeck.mode
                localStorage.setItem('flashDeck-' + action.data.flashDeck.id, JSON.stringify(action.data.flashDeck))
                action.data.flashDeck.mode = mode
                synchronise()
            }
            else if (action.type === NEXT_CARD) {
                console.log('Middleware NEXT_CARD')
                if (action.data.flashDeck) {
                    if (!action.data.flashDeck.flashCards) {
                        action.data.flashDeck.flashCards = []
                    }
                    if (action.data.flashDeck.mode == 'TEST') {
                        selectNextCard(action.data.flashDeck)
                    } else {
                        if (action.data.flashDeck.hasOwnProperty('currentIndex')) {
                            action.data.flashDeck.currentIndex++
                        } else {
                            action.data.flashDeck.currentIndex = 0
                        }
                        if (action.data.flashDeck.flashCards.length <= action.data.flashDeck.currentIndex && action.data.flashDeck.mode == 'EDIT') {
                            action.data.flashDeck.flashCards.push({})
                        }
                        if (action.data.flashDeck.currentIndex < action.data.flashDeck.flashCards.length) {
                            delete action.data.flashDeck.flashCards[action.data.flashDeck.currentIndex].correct
                        }
                    }
                }
            } else if (action.type === LOAD_DECKS) {
                console.log('Middleware LOAD_DECKS')
                var decks = []
                var keys = Object.entries(localStorage)
                for (var i = 0; i < localStorage.length; i++) {
                    var key = keys[i];
                    if (key[0].indexOf('flashDeck-') == 0) {
                        decks.push(JSON.parse(localStorage.getItem(key[0])))
                    }
                }
                action.flashDecks = decks
            } else if (action.type === LOAD_FLASHDECK) {
                console.log('Middleware LOAD_FLASHDECK')
                var flashDeck = JSON.parse(localStorage.getItem('flashDeck-' + action.data.flashDeckId))
                action.data.flashDeck = flashDeck
                flashDeck.dirty = false
                delete flashDeck.currentIndex
                action.data.flashDeck.mode = action.data.mode ? action.data.mode : 'TEST'
                if (action.data.answerType && action.data.testType) {
                    flashDeck.answerType = action.data.answerType
                    flashDeck.testType = action.data.testType
                    selectNextCard(flashDeck)
                }
            }
            else if (action.type === SCORE_CARD) {
                scoreCard(action.data.flashDeck);
                if (action.data.flashDeck.testType != 'REVISION' && action.data.flashDeck.testType != 'CRAM') {
                    selectNextCard(action.data.flashDeck)
                }
                console.log('Middleware SCORE_CARD')
            } else if (action.type === DELETE_DECK) {
                console.log('Middleware DELETE_DECK')
                let deletedDeck = JSON.stringify({ id: action.data.flashDeckId })
                localStorage.setItem('delete-flashDeck-' + action.data.flashDeckId, deletedDeck)
                localStorage.removeItem('flashDeck-' + action.data.flashDeckId)
                synchronise()
            } else if (action.type === DELETE_CARD) {
                console.log('Middleware DELETE_CARD')
                action.data.flashDeck.flashCards.splice(action.data.flashDeck.currentIndex, 1)
                if (action.data.flashDeck.currentIndex >= action.data.flashDeck.flashCards.length) {
                    action.data.flashDeck.currentIndex = action.data.flashDeck.flashCards.length - 1
                    if (action.data.flashDeck.currentIndex < 0) {
                        delete action.data.flashDeck.currentIndex
                    }
                }
            } else if (action.type === PREV_CARD) {
                console.log('Middleware PREV_CARD')
                action.data.flashDeck.currentIndex = action.data.flashDeck.currentIndex - 1
                if (action.data.flashDeck.currentIndex < 0) {
                    delete action.data.flashDeck.currentIndex
                }
            } else if (action.type === LOAD_GANGS) {
                console.log('Middleware LOAD_GANGS')
                var gangs = []
                var keys = Object.entries(localStorage)
                for (var i = 0; i < localStorage.length; i++) {
                    var key = keys[i];
                    if (key[0].indexOf('flashGang-') == 0) {
                        gangs.push(JSON.parse(localStorage.getItem(key[0])))
                    }
                }
                action.flashGangs = gangs
            } else if (action.type === SAVE_GANG) {
                if (!action.data.flashGang.id) {
                    action.data.flashGang.id = uuidv4()
                }
                //delete action.data.flashDeck.dirty
                let cleanGang = Object.assign({}, action.data.flashGang)
                cleanGang.flashDecks = []
                if (action.data.flashGang.flashDecks) {
                    for (var i in action.data.flashGang.flashDecks) {
                        let gangDeck = action.data.flashGang.flashDecks[i]
                        cleanGang.flashDecks.push(gangDeck.id)
                    }
                }
                localStorage.setItem('flashGang-' + action.data.flashGang.id, JSON.stringify(cleanGang))
                action.flashGang = action.data.flashGang;
                delete action.data.flashGang;
                synchronise()
            } else if (action.type === LOAD_FLASHGANG) {
                console.log('Middleware LOAD_FLASHGANG')
                var flashGang = JSON.parse(localStorage.getItem('flashGang-' + action.data.flashGangId))
                action.flashGang = flashGang
                //flashDeck.dirty = false
                let gangDecks = []
                if (flashGang.flashDecks) {
                    for (var i in flashGang.flashDecks) {
                        let deckId = flashGang.flashDecks[i]
                        let deck = JSON.parse(localStorage.getItem('flashDeck-' + deckId))
                        gangDecks.push(deck)
                    }
                }
                flashGang.flashDecks = gangDecks
            } else if (action.type === CREATE_ACCOUNT) {
                dispatch({ type: LOADING, data: { loading: true } })
                console.log('Middleware CREATE_ACCOUNT')
                var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let isValid = regExp.test((action.data.user.id).toLowerCase());
                let errors = { fields: [] }
                if (!isValid) {
                    errors.fields.push({ id: 'Email address must be valid.' })
                }
                if (action.data.user.password != action.data.user.confirmPassword) {
                    errors.fields.push({ password: 'Passwords must be identical.' })
                }
                if (errors.fields.length > 0) {
                    action.errors = errors
                } else {
                    let questObject = {}
                    questObject.params = Object.assign({}, action.data.user)
                    questObject.resource = 'account'
                    let postResult = await postToServer(questObject)
                    if (postResult.token) {
                        localStorage.setItem('flashJwt', postResult.token)
                        localStorage.setItem('flashJwtRefresh', postResult.refresh)
                    }
                    if (postResult.errors) {
                        action.errors = postResult.errors
                    }
                }
            } else if (action.type === LOGIN) {
                console.log('Middleware LOGIN')
                dispatch({ type: LOADING, data: { loading: true } })
                let questObject = {}
                questObject.params = Object.assign({}, action.data.user)
                questObject.resource = 'login'
                questObject.params.grant_type = 'password'
                let postResult = await postToServer(questObject)
                if (postResult.token) {
                    localStorage.setItem('flashJwt', postResult.token)
                    localStorage.setItem('flashJwtRefresh', postResult.refresh)
                    await synchronise()
                } else {
                    action.errors = postResult.errors
                }
            } else if (action.type === RSVP) {
                console.log('Middleware RSVP')
                let questObject = {}
                questObject.params = Object.assign({}, action.data)
                questObject.resource = 'rsvp'
                let postResult = await postToServer(questObject)
                synchronise()
            } else if (action.type === RESET_PASSWORD) {
                console.log('Middleware RESET_PASSWORD')
                dispatch({ type: LOADING, data: { loading: true } })
                let questObject = {}
                questObject.params = Object.assign({}, action.data.user)
                questObject.params.account_function = 'resetpw'
                questObject.resource = 'resetpw'
                let postResult = await postToServer(questObject)
                action.errors = postResult.errors
            } else if (action.type === SET_PASSWORD) {
                console.log('Middleware SET_PASSWORD')
                dispatch({ type: LOADING, data: { loading: true } })
                if (action.data.user.password != action.data.user.confirmPassword) {
                    let errors = {}
                    errors.fields.push({ password: 'Passwords must be identical.' })
                } else {
                    let questObject = {}
                    questObject.params = Object.assign({}, action.data.user)
                    questObject.params.account_function = 'setpw'
                    questObject.resource = 'setpw'
                    questObject.params.token = action.data.token
                    let postResult = await postToServer(questObject)
                    if (postResult.token) {
                        localStorage.setItem('flashJwt', postResult.token)
                        localStorage.setItem('flashJwtRefresh', postResult.refresh)
                        await synchronise()
                    } else {
                        action.errors = postResult.errors
                    }
                }
            }
            return next(action);
        }
    };
};