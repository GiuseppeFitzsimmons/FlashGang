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
export const RSVP = 'RSVP';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const SET_PASSWORD = 'SET_PASSWORD';
export const SAVE_SCORE = 'SAVE_SCORE';
export const POLL = 'POLL';
export const DELETE_GANG = 'DELETE_GANG';
export const SYNCHRONISE = 'SYNCHRONISE';
export const SET_SETTINGS = 'SET_SETTINGS';
export const ENDSYNCHRONISE = 'ENDSYNCHRONISE';
export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';


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
export function loadFlashDeck(flashDeckId, mode, answerType, testType, source) {
    console.log("Action LOAD_FLASHDECK")
    console.log('source', source)
    return { type: LOAD_FLASHDECK, data: { flashDeckId, mode, answerType, testType, source } }

}
export function scoreCard(flashDeck) {
    console.log("Action SCORE_CARD")
    return { type: SCORE_CARD, data: { flashDeck } }

}
export function deleteDeck(flashDeckId) {
    console.log("Action DELETE_DECK")
    return { type: DELETE_DECK, data: { flashDeckId } }

}
export function deleteGang(flashGangId) {
    console.log("Action DELETE_GANG")
    return { type: DELETE_GANG, data: { flashGangId } }

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
export function sendRSVP(flashGangId, acceptance) {
    console.log("Action RSVP")
    return { type: RSVP, data: { flashGangId, acceptance } }

}
export function resetPassword(user) {
    console.log("Action RESET_PASSWORD")
    return { type: RESET_PASSWORD, data: { user } }

}
export function setPassword(user, token) {
    console.log("Action SET_PASSWORD")
    return { type: SET_PASSWORD, data: { user, token } }

}
export function poll(poll) {
    console.log("Action POLL")
    return { type: POLL, data: { poll } }

}
export function synchronise() {
    console.log("Action SYNCHRONISE")
    return { type: SYNCHRONISE}

}
export function setSettings(user) {
    console.log("Action SET_SETTINGS")
    return { type: SET_SETTINGS, data: {user}}

}
export function uploadImage(source) {
    console.log("Action UPLOAD_IMAGE")
    return { type: UPLOAD_IMAGE, data: {source}}

}