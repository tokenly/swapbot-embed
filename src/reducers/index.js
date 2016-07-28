import { combineReducers } from 'redux';
import swapObjects         from './swapObjects'
import uiState             from './uiState'
import desiredSwap         from './desiredSwap'
import matchedSwap         from './matchedSwap'


const rootReducer = combineReducers({
  swapObjects: swapObjects,
  uiState:     uiState,
  desiredSwap: desiredSwap,
  matchedSwap: matchedSwap,
});

export default rootReducer;
