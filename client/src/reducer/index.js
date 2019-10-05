import {NEW_DECK, SAVE_DECK, NEXT_CARD} from '../action';

const initialState = {};

function rootReducer(state = initialState, action) {
    console.log('Reducer');
    switch (action.type) {
        case NEW_DECK:
            state = Object.assign({},state,{flashDeck:action.data.flashDeck})
            return state
        case SAVE_DECK:    
            state = Object.assign({},state,{flashDeck:action.data.flashDeck})
            return state
        case NEXT_CARD:
            console.log(action)
            state = Object.assign({},state,{flashDeck:action.data.flashDeck})
            return state
      default:
        return state
    }
  };
  export default rootReducer;