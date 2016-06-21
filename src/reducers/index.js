import { combineReducers } from 'redux';
import bot from './bot'
import swapConfig from './swapConfig'
import uiState from './uiState'
import desiredSwap from './desiredSwap'


const rootReducer = combineReducers({
  bot:         bot,
  swapConfig:  swapConfig,
  uiState:     uiState,
  desiredSwap: desiredSwap,
});

export default rootReducer;
