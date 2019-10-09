import { NEW_DECK, SAVE_DECK, NEXT_CARD, LOAD_DECKS, LOAD_FLASHDECK, SCORE_CARD } from '../action'

const uuidv4 = require('uuid/v4');

function scoreCard(deck) {
    console.log('deck', deck)
    if (!deck.hasOwnProperty('currentIndex')) {
        return
    }
    let card = deck.flashCards[deck.currentIndex]
    card.correct = true
    if (!card.userAnswer || card.userAnswer == '') {
        card.correct = false
    } else {
        if (card.userAnswer != card.correctAnswers[0]) {
            card.correct = false
        }
    }
}
function selectNextCard(deck) {
    const answerType = deck.answerType
    const testType = deck.testType
    if (testType == 'EXAM') {
        if (deck.currentIndex && deck.currentIndex + 1 >= deck.flashCards.length) {
            deck.mode = 'COMPLETE'
        } else {
            deck.currentIndex++
        }
    } else if (testType == 'REVISION') {
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
        let unansweredCards = []
        for (var i in deck.flashCards) {
            let card = deck.flashCards[i]
            if (!card.correct) {
                unansweredCards.push(i)
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
                console.log('card.multipleChoices', card.multipleChoices)
                if (answers.length==0){
                    break
                }
            }
            card.multipleChoices = card.multipleChoices.sort((a,b)=>{
                return Math.floor(Math.random() * Math.floor(3))-1
            })
        }
    }
}
export function flashGangMiddleware({ dispatch }) {
    return function (next) {
        return async function (action) {
            if (action.type === NEW_DECK) {
                console.log('Middleware NEW_DECK')
                action.data.flashDeck = { mode: 'EDIT' }
            }
            else if (action.type === SAVE_DECK) {
                console.log('Middleware SAVE_DECK')
                if (!action.data.flashDeck.id) {
                    action.data.flashDeck.id = uuidv4()
                }
                delete action.data.flashDeck.mode
                localStorage.setItem('flashDeck-' + action.data.flashDeck.id, JSON.stringify(action.data.flashDeck))
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
                delete action.data.flashDeck.currentIndex
                action.data.flashDeck.mode = action.data.mode ? action.data.mode : 'TEST'
            }
            else if (action.type === SCORE_CARD) {
                scoreCard(action.data.flashDeck)
                console.log('Middleware SCORE_CARD')
            }
            return next(action);
        }
    };
};