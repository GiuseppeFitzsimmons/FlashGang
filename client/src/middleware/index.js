import { NEW_DECK, SAVE_DECK, NEXT_CARD, LOAD_DECKS } from '../action'

const uuidv4 = require('uuid/v4');

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
                localStorage.setItem('flashDeck-' + action.data.flashDeck.id, JSON.stringify(action.data.flashDeck))
            }
            else if (action.type === NEXT_CARD) {
                console.log('Middleware NEXT_CARD')
                if (action.data.flashDeck) {
                    if (action.data.flashDeck.mode == 'EDIT') {
                        if (!action.data.flashDeck.flashCards) {
                            action.data.flashDeck.flashCards = []
                        }
                        if (action.data.flashDeck.hasOwnProperty('currentIndex')) {
                            action.data.flashDeck.currentIndex++
                        } else {
                            action.data.flashDeck.currentIndex = 0
                        }
                        if (action.data.flashDeck.flashCards.length <= action.data.flashDeck.currentIndex) {
                            action.data.flashDeck.flashCards.push({})
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
            }
            return next(action);
        }
    };
};