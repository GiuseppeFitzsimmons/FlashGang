import {NEW_DECK, SAVE_DECK, NEXT_CARD} from '../action';

const initialState = {};

function rootReducer(state = initialState, action) {
    console.log('Reducer');
    let flashDeck;
    if (action && action.data && action.data.flashDeck) {
        //This is why flashdeck wasn't updating - redux insists that you exchange immutable objects
        //In practice this means that if your state contains the same objects when it's next seen by
        //mapStateToProps, then it will punish you by assuming that you don't want to apply any changes.
        //The (probably not-best-practice) workaround is to make flashDeck a copy of the one in the action.
        flashDeck=Object.assign({},action.data.flashDeck)
    }
    switch (action.type) {
        case NEW_DECK:
            state = Object.assign({},state,{flashDeck})
            return state
        case SAVE_DECK:
            state = Object.assign({},state,{flashDeck})
            return state
        case NEXT_CARD:
            console.log(action)
            state = Object.assign({random: Math.random()},state,{flashDeck})
            return state
      default:
        return state
    }
  };
  export default rootReducer;