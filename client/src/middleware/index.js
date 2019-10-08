import { NEW_DECK, SAVE_DECK, NEXT_CARD, LOAD_DECKS, LOAD_FLASHDECK, SCORE_CARD } from '../action'

const uuidv4 = require('uuid/v4');

function scoreCard(deck) {
    console.log('deck', deck)
    if (!deck.hasOwnProperty('currentIndex')){
        return
    }
    let card = deck.flashCards[deck.currentIndex]
    card.correct = true
    if (!card.userAnswer || card.userAnswer == '') {
        card.correct = false
    } else {
        if (card.userAnswer!=card.correctAnswers[0]) {
            card.correct = false
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
                    if (action.data.flashDeck.hasOwnProperty('currentIndex')) {
                        action.data.flashDeck.currentIndex++
                    } else {
                        action.data.flashDeck.currentIndex = 0
                    }
                    if (action.data.flashDeck.flashCards.length <= action.data.flashDeck.currentIndex && action.data.flashDeck.mode == 'EDIT') {
                        action.data.flashDeck.flashCards.push({})
                    }
                    if (action.data.flashDeck.currentIndex<action.data.flashDeck.flashCards.length){
                        delete action.data.flashDeck.flashCards[action.data.flashDeck.currentIndex].correct
                    } else {
                        action.data.flashDeck.finished = 'Complete'
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