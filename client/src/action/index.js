export const NEW_DECK = 'NEW_DECK';
export const NEW_GANG = 'NEW_GANG';
export const SAVE_DECK = 'SAVE_DECK';
export const NEXT_CARD = 'NEXT_CARD';
export const LOAD_DECKS = 'LOAD_DECKS';
export const LOAD_FLASHDECK = 'LOAD_FLASHDECK';
export const SCORE_CARD = 'SCORE_CARD';
export const DELETE_DECK = 'DELETE_DECK';
export const DELETE_CARD = 'DELETE_CARD';
export const PREV_CARD = 'PREV_CARD';
export const LOAD_GANGS = 'LOAD_GANGS';
export const SAVE_GANG = 'SAVE_GANG';
export const LOAD_FLASHGANG = 'LOAD_FLASHGANG';
export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const LOGIN = 'LOGIN';
export const LOADING = 'LOADING';


export function newDeck() {
    console.log("Action NEW_DECK")
    return { type: NEW_DECK, data: { flashDeck: {} } }
}
export function newGang() {
    console.log("Action NEW_GANG")
    return { type: NEW_GANG, data: { flashGang: {} } }
}
export function saveDeck(flashDeck) {
    console.log("Action SAVE_DECK")
    return { type: SAVE_DECK, data: { flashDeck } }
}
export function nextCard(flashDeck) {
    console.log("Action NEXT_CARD")
    return { type: NEXT_CARD, data: { flashDeck } }
}
export function loadDecks() {
    console.log("Action LOAD_DECKS")
    return { type: LOAD_DECKS }
}
export function loadFlashDeck(flashDeckId, mode, answerType, testType) {
    console.log("Action LOAD_FLASHDECK")
    console.log('mode', mode, 'answerType', answerType, 'testType', testType)
    return { type: LOAD_FLASHDECK, data: { flashDeckId, mode, answerType, testType } }

}
export function scoreCard(flashDeck) {
    console.log("Action SCORE_CARD")
    return { type: SCORE_CARD, data: { flashDeck } }

}
export function deleteDeck(flashDeckId) {
    console.log("Action DELETE_DECK")
    return { type: DELETE_DECK, data: { flashDeckId } }

}
export function deleteCard(flashDeck) {
    console.log("Action DELETE_CARD")
    return { type: DELETE_CARD, data: { flashDeck } }

}
export function prevCard(flashDeck) {
    console.log("Action PREV_CARD")
    return { type: PREV_CARD, data: { flashDeck } }

}
export function loadGangs() {
    console.log("Action LOAD_GANGS")
    return { type: LOAD_GANGS }
}
export function saveGang(flashGang) {
    console.log("Action SAVE_GANG")
    return { type: SAVE_GANG, data: { flashGang } }
}
export function loadFlashGang(flashGangId) {
    console.log("Action LOAD_FLASHGANG")
    return { type: LOAD_FLASHGANG, data: { flashGangId } }

}
export function createAccount(user) {
    console.log("Action CREATE_ACCOUNT")
    return { type: CREATE_ACCOUNT, data: { user } }

}
export function logIn(user) {
    console.log("Action LOGIN")
    return { type: LOGIN, data: { user } }

}