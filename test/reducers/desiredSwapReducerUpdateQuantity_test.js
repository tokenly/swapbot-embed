import { expect }          from '../test_helper';
import desiredSwapReducer  from '../../src/reducers/desiredSwap'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapObjectGenerator from '../testHelpers/swapObjectGenerator'
import botGenerator        from '../testHelpers/botGenerator'

describe('Desired Swap Reducer Quantity Change' , () => {
    it('sets the in quantity from out quantity', () => {
        let swapObjects = [
            swapObjectGenerator.alpha({in: 'XCP', rate: 10}),
            swapObjectGenerator.rateSellConfig({out: 'COAL'}, botGenerator.botOne({balances: {COAL: 1000, BTC: 2}})),
        ]
        let stateBefore = desiredSwapReducer({}, {type: c.SET_POSSIBLE_SWAP_OBJECTS, swapObjects: swapObjects})

        let action = buildSetOutTokenQuantityAction({quantity: 20});
        deepFreeze(stateBefore);
        deepFreeze(action);
        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.validationError).to.be.null
        expect(newState.isValid).to.be.true
        expect(newState.out.token).to.equal('COAL')
        expect(newState.out.quantity).to.equal(20)
        expect(newState.in.token).to.equal('BTC')
        expect(newState.in.quantity).to.equal('0.4')
    })

    it('sets the out quantity from in quantity', () => {
        let swapObjects = [
            swapObjectGenerator.alpha({in: 'XCP', rate: 10}),
            swapObjectGenerator.rateSellConfig({out: 'COAL'}, botGenerator.botOne({balances: {COAL: 1000, BTC: 2}})),
        ]
        let stateBefore = desiredSwapReducer({}, {type: c.SET_POSSIBLE_SWAP_OBJECTS, swapObjects: swapObjects})
        stateBefore = desiredSwapReducer(stateBefore, buildSetOutTokenAction({token: 'COAL'}));

        let action = buildSetInTokenQuantityAction({quantity: 0.6});
        deepFreeze(stateBefore);
        deepFreeze(action);
        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.validationError).to.be.null
        expect(newState.isValid).to.be.true
        expect(newState.out.token).to.equal('COAL')
        expect(newState.in.token).to.equal('BTC')
        expect(newState.out.quantity).to.equal('30')
        expect(newState.in.quantity).to.equal(0.6)
    })



});

function dispatchSetSwapAndBotActionWithQuantity() {
    let a1 = desiredSwapReducer({}, buildSetSwapAndBotAction());
    return desiredSwapReducer(a1, buildSetOutTokenQuantityAction());
}

function buildSetOutTokenAction(action={}) {
    return {
        type: c.INPUT_SET_OUT_TOKEN,
        token: 'COAL',
        ...action
    };
}
function buildSetInTokenAction(action={}) {
    return {
        type: c.INPUT_SET_IN_TOKEN,
        token: 'BTC',
        ...action
    };
}

function buildSetOutTokenQuantityAction(action={}) {
    return {
        type: c.INPUT_SET_OUT_TOKEN_QUANTITY,
        quantity: 10,
        ...action
    };
}

function buildSetInTokenQuantityAction(action={}) {
    return {
        type: c.INPUT_SET_IN_TOKEN_QUANTITY,
        quantity: 10,
        ...action
    };
}


function buildSetSwapAndBotAction() {
    return {
        type: c.CHOOSE_SWAP_OBJECT,
        bot: { name: 'My Bot', balances: {BTC: 2, COAL: 1000} },
        swapObject: swapObjectGenerator.rateSellConfig({out: 'COAL'})
    };
}
