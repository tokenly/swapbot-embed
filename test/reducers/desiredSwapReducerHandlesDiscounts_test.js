import { expect }          from '../test_helper';
import desiredSwapReducer  from '../../src/reducers/desiredSwap'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapConfigGenerator from '../testHelpers/swapConfigGenerator'

describe('Desired Swap Reducer with Discounts' , () => {
    it('handles basic rate discount', () => {
        let stateBefore = dispatchSetSwapAndBotAction();
        let action = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore);
        deepFreeze(action);
        let newState = desiredSwapReducer(stateBefore, action)
        expect(newState.in.token).to.equal('BTC')
        expect(roundToSatoshi(newState.in.quantity)).to.equal(makeDiscount(0.2, 0.1))
    })

    it('handles second rate discount', () => {
        let stateBefore = dispatchSetSwapAndBotAction();
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

function dispatchSetSwapAndBotAction() {
    return desiredSwapReducer({}, buildSetSwapAndBotAction());
}

function buildSetOutTokenQuantityAction(overrides={}) {
    return {
        type: c.INPUT_SET_OUT_TOKEN_QUANTITY,
        quantity: 10,
        ...overrides
    };
}

function buildSetSwapAndBotAction() {
    return {
        type: c.SET_SWAP_AND_BOT,
        bot: { name: 'My Bot', balances: {TOKENLY: 100} },
        swapConfig: swapConfigGenerator.rateSellConfigWithDiscount()
    };
}

