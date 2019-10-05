import { NEW_DECK, SAVE_DECK, NEXT_CARD } from '../action'
import { BrowserDatabase } from 'browser-database';

const browserDatabase = new BrowserDatabase({
    storageType: 'localStorage',
    storageKey: 'databaseName'
});

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
                    action.data.flashDeck.id = 'UUID'
                } else {
                    action.data.flashDeck.id = 'New UUID'
                }
                if (action.deck.flashCards) {
                    for (var i in action.data.flashDeck.flashCards) {
                        let card = action.data.flashDeck.flashCards[i]
                        if (!card.id) {
                            card.id = 'UUID'
                        } else {
                            card.id = 'New UUID'
                        }
                    }
                }
            }
            else if (action.type === NEXT_CARD) {
                console.log('Middleware NEXT_CARD')
                if (action.data.flashDeck) {
                    if (action.data.flashDeck.mode == 'EDIT') {
                        if (!action.data.flashDeck.flashCards) {
                            action.data.flashDeck.flashCards = []
                        }
                        if (action.data.flashDeck.currentIndex) {
                            action.data.flashDeck.currentIndex++
                        } else {
                            action.data.flashDeck.currentIndex = 0
                        }
                        if (action.data.flashDeck.flashCards.length <= action.data.flashDeck.currentIndex) {
                            action.data.flashDeck.flashCards.push({})
                        }
                    }
                }
            }
            return next(action);
        }
    };
};