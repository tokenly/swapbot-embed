import { expect }          from '../test_helper';
import desiredSwapReducer  from '../../src/reducers/desiredSwap'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapObjectGenerator from '../testHelpers/swapObjectGenerator'
import botGenerator        from '../testHelpers/botGenerator'
import stateChecker        from '../testHelpers/stateChecker'

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


    it('changes the in quantity when the in token is changed', () => {
        let swapObjects = [
            swapObjectGenerator.alpha({in: 'BTC', rate: 50}),
            swapObjectGenerator.alpha({in: 'XCP', rate: 5}),
            swapObjectGenerator.beta( {in: 'BTC', rate: 10}),
            swapObjectGenerator.beta( {in: 'XCP', rate: 1}),
        ]
        let stateBefore = desiredSwapReducer({}, {type: c.SET_POSSIBLE_SWAP_OBJECTS, swapObjects: swapObjects})

        // select beta to purchase (out)
        let workingState = desiredSwapReducer(stateBefore, buildSetOutTokenAction({token: 'ALPHA'}));

        // select BTC to pay with (in)
        workingState = desiredSwapReducer(workingState, buildSetInTokenAction({token: 'BTC'}));

        // select quantity of 1 beta to purchase (out)
        workingState = desiredSwapReducer(workingState, buildSetOutTokenQuantityAction({quantity: 1}));

        // state should be an 1 ALPHA out for 0.02 BTC in
        stateChecker.checkSwap(workingState, [1, 'ALPHA', '0.02', 'BTC']);

        // now change the token to pay with (in)
        console.log('setting new in token');
        workingState = desiredSwapReducer(workingState, buildSetInTokenAction({token: 'XCP'}));

        // the quantity to pay (in) with should change
        stateChecker.checkSwap(workingState, [1, 'ALPHA', '0.2', 'XCP']);
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
