import { combineReducers } from 'redux';
import swapObjects         from './swapObjects'
import uiState             from './uiState'
import desiredSwap         from './desiredSwap'


const rootReducer = combineReducers({
  swapObjects: swapObjects,
  uiState:     uiState,
  desiredSwap: desiredSwap,
});

export default rootReducer;
