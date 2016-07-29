import c                   from '../../src/constants'
import actions             from '../../src/actions'
import swapObjectGenerator from './swapObjectGenerator'
import desiredSwapReducer  from '../../src/reducers/desiredSwap'

let generator = {}

generator.buildSetDesiredSwapAction = (outQty, outToken, inQty, inToken) => {
    // build the desiredSwap
    let desiredSwap = generator.buildDesiredSwap(outQty, outToken, inQty, inToken);
    return actions.setDesiredSwapstreamSwap(desiredSwap);
}


generator.buildDesiredSwap = (outQty, outToken, inQty, inToken) => {
    let action, state;

    // set the possible swap objects
    state = desiredSwapReducer({}, actions.setSwapObjects([swapObjectGenerator.rateSellConfig({})]));

    // set the out token and quantity and let the reducer calculate the in values
    state = desiredSwapReducer(state, actions.setOutToken(outToken));
    state = desiredSwapReducer(state, actions.setOutTokenQuantity(outQty));

    return state;
}
 



export default generator;