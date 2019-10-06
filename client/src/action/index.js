export const NEW_DECK = 'NEW_DECK';
export const SAVE_DECK = 'SAVE_DECK';
export const NEXT_CARD = 'NEXT_CARD';
export const LOAD_DECKS = 'LOAD_DECKS';


export function newDeck()    
{
    console.log("Action NEW_DECK")
    return {type:NEW_DECK,data:{flashDeck:{}}}
}
export function saveDeck(flashDeck)    
{
    console.log("Action SAVE_DECK")
    return {type:SAVE_DECK,data:{flashDeck}}
}
export function nextCard(flashDeck)    
{
    console.log("Action NEXT_CARD")
    return {type:NEXT_CARD,data:{flashDeck}}
}
export function loadDecks()    
{
    console.log("Action LOAD_DECKS")
    return {type:LOAD_DECKS}
}