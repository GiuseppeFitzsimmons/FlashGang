import { UPLOAD_IMAGE, SET_PASSWORD, DELETE_GANG, RSVP, LOADING, NEW_DECK, SAVE_DECK, NEXT_CARD, LOAD_DECKS, LOAD_FLASHDECK, SCORE_CARD, DELETE_DECK, DELETE_CARD, PREV_CARD, LOAD_GANGS, NEW_GANG, SAVE_GANG, LOAD_FLASHGANG, CREATE_ACCOUNT, LOGIN, RESET_PASSWORD, POLL, GET_IMAGES } from '../action';

const initialState = {};
var user

function rootReducer(state = initialState, action) {
    console.log('Reducer', action);
    let flashDeck;
    if (action.data && action.data.user) {
        user = action.data.user
    } else if (action.user) {
        user = action.user
    } else /*if (!user)*/ {
        user = JSON.parse(localStorage.getItem('currentUser'))
    }
    console.log('reducer user', user)
    state.user = Object.assign({}, user)
    if (action && action.data && action.data.flashDeck) {
        //This is why flashdeck wasn't updating - redux insists that you exchange immutable objects
        //In practice this means that if your state contains the same objects when it's next seen by
        //mapStateToProps, then it will punish you by assuming that you don't want to apply any changes.
        //The (probably not-best-practice) workaround is to make flashDeck a copy of the one in the action.
        flashDeck = Object.assign({}, action.data.flashDeck)
    }
    switch (action.type) {
        case NEW_DECK:
            state = Object.assign({}, state, { flashDeck })
            return state
        case NEW_GANG:
            state = Object.assign({}, state, { flashGang: action.flashGang })
            return state
        case SAVE_DECK:
            state = Object.assign({}, state, { flashDeck })
            return state
        case NEXT_CARD:
            console.log(action)
            state = Object.assign({}, state, { flashDeck })
            return state
        case LOAD_DECKS:
            state = Object.assign({}, state, { flashDecks: action.flashDecks })
            return state
        case LOAD_FLASHDECK:
            state = Object.assign({}, state, { flashDeck })
            return state
        case SCORE_CARD:
            state = Object.assign({}, state, { flashDeck })
            return state
        case DELETE_DECK:
            state = Object.assign({}, state, { flashDeck: null })
            return state
        case DELETE_CARD:
            state = Object.assign({}, state, { flashDeck })
            return state
        case PREV_CARD:
            state = Object.assign({}, state, { flashDeck })
            return state
        case LOAD_GANGS:
            state = Object.assign({}, state, { flashGangs: action.flashGangs })
            return state
        case SAVE_GANG:
            state = Object.assign({}, state, { flashGang: action.flashGang })
            return state
        case LOAD_FLASHGANG:
            state = Object.assign({}, state, { flashGang: action.flashGang })
            return state
        case CREATE_ACCOUNT:
            state = Object.assign({}, state, { loggedIn: action.errors ? false : true, errors: action.errors, user: action.data.user, loading: false })
            return state
        case LOGIN:
            state = Object.assign({}, state, { loggedIn: action.errors ? false : true, errors: action.errors, user: action.data.user, loading: false })
            return state
        case LOADING:
            state = Object.assign({}, state, { loading: action.data.loading, id: action.data.id })
            return state
        case RSVP:
            return state
        case RESET_PASSWORD:
            state = Object.assign({}, state, { loading: false, errors: action.errors })
            return state
        case SET_PASSWORD:
            state = Object.assign({}, state, { loading: false, errors: action.errors, loggedIn: action.errors ? false : true })
            return state
        case POLL:
            return state
        case DELETE_GANG:
            state = Object.assign({}, state, { flashGang: null })
            return state
        case UPLOAD_IMAGE:
            state = Object.assign({}, state, { loading: false, url: action.url, id: action.id, errors: action.errors })
            return state
        case GET_IMAGES:
            state = Object.assign({}, state, {images: action.images})
            return state
        default:
            console.log('state', state)
            return state
    }
};
export default rootReducer;