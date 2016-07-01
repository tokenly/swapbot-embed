import { expect }          from '../test_helper';
import desiredSwapReducer  from '../../src/reducers/desiredSwap'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapObjectGenerator from '../testHelpers/swapObjectGenerator'

describe('Desired Swap Reducer with Discounts' , () => {
    it('handles basic rate discount', () => {
        let stateBefore = setup();
        let action = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore);
        deepFreeze(action);
        let newState = desiredSwapReducer(stateBefore, action)
        expect(newState.in.token).to.equal('BTC')
        expect(roundToSatoshi(newState.in.quantity)).to.equal(makeDiscount(0.2, 0.1))
    })

    it('handles second rate discount', () => {
        let stateBefore = setup();
        let action = buildSetOutTokenQuantityAction({quantity: 20});
        deepFreeze(stateBefore);
        deepFreeze(action);
        let newState = desiredSwapReducer(stateBefore, action)
        expect(newState.in.token).to.equal('BTC')
        expect(roundToSatoshi(newState.in.quantity)).to.equal(makeDiscount(0.4, 0.2))
    })

});

// ------------------------------------------------------------------------

function makeDiscount(baseAmount, discountPct) {
    return roundToSatoshi(baseAmount - baseAmount * discountPct);
}

function roundToSatoshi(float) {
    return Math.round(float * c.SATOSHI, 10) / c.SATOSHI;
}




function setup() {
    let state = {};
    state = dispatchSetSwapObjects(state);
    state = dispatchSetOutToken(state);
    return state;
}

function dispatchSetSwapObjects(state={}, configOverrides={}) {
    return desiredSwapReducer(state, buildSetSwapObjectsAction(configOverrides));
}
function dispatchSetOutToken(state={}, token='TOKENLY') {
    return desiredSwapReducer(state, buildSetOutTokenAction({token: token}));
}


function buildSetOutTokenAction(action={}) {
    return {
        type:  c.INPUT_SET_OUT_TOKEN,
        token: 'TOKENLY',
        ...action
    };
}

function buildSetOutTokenQuantityAction(action={}) {
    return {
        type:     c.INPUT_SET_OUT_TOKEN_QUANTITY,
        quantity: 10,
        ...action
    };
}

function buildSetSwapObjectsAction(configOverrides={}) {
    return {
        type:        c.SET_POSSIBLE_SWAP_OBJECTS,
        swapObjects: [swapObjectGenerator.rateSellConfigWithDiscount(configOverrides)],
    };
}



