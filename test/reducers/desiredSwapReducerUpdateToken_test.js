import { expect }          from '../test_helper';
import desiredSwapReducer  from '../../src/reducers/desiredSwap'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapObjectGenerator from '../testHelpers/swapObjectGenerator'

describe('Desired Swap Reducer Token Change' , () => {
    it('sets the out and in token', () => {
        let stateBefore = dispatchSetSwapAndBotActionWithQuantity();
        let action = buildSetOutTokenAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.token).to.equal('COAL')
        expect(newState.in.token).to.equal('BTC')
        expect(newState.validationError).to.be.null
        expect(newState.isValid).to.be.true
    })

    it('chooses the first in token when out token is set', () => {
        let stateBefore = desiredSwapReducer({}, {type: c.SET_POSSIBLE_SWAP_OBJECTS, swapObjects: swapObjectGenerator.alphaAndBetaArray()})

        let action = buildSetOutTokenAction({token: 'BETA'});
        deepFreeze(stateBefore);
        deepFreeze(action);
        let newState = desiredSwapReducer(stateBefore, action);

        expect(newState.out.token).to.equal('BETA')
        expect(newState.in.token).to.equal('BTC')
        expect(newState.in.quantity).to.equal('')
        expect(newState.validationError).to.be.null
        expect(newState.isValid).to.be.true
    })

    it('chooses the first out token available when choosing a new in token with no corresponding out token', () => {
        let swapObjects = [
            swapObjectGenerator.alpha({in: 'XCP', rate: 10}),
            swapObjectGenerator.beta({in: 'BTC', rate: 10}),
        ]
        let stateBefore = desiredSwapReducer({}, {type: c.SET_POSSIBLE_SWAP_OBJECTS, swapObjects: swapObjects})

        let action = buildSetOutTokenAction({token: 'ALPHA'});
        let newState = desiredSwapReducer(stateBefore, action);

        action = buildSetInTokenAction({token: 'BTC'});
        newState = desiredSwapReducer(stateBefore, action);

        expect(newState.out.token).to.equal('BETA')
        expect(newState.in.token).to.equal('BTC')
        expect(newState.in.quantity).to.equal('')
        expect(newState.validationError).to.be.null
        expect(newState.isValid).to.be.true
    })

    it('keeps the chosen out token when a new in token is set', () => {
        let stateBefore = desiredSwapReducer({}, {type: c.SET_POSSIBLE_SWAP_OBJECTS, swapObjects: swapObjectGenerator.alphaBetaWithXCP()})
        // console.log('stateBefore.swapObjects', stateBefore.swapObjects);

        // select beta to purchase (out)
        let workingState = desiredSwapReducer(stateBefore, buildSetOutTokenAction({token: 'BETA'}));

        // select xcp to pay with (in)
        workingState = desiredSwapReducer(workingState, buildSetInTokenAction({token: 'XCP'}));
        // console.log('workingState', workingState);

        // out token should still be BETA
        expect(workingState.isValid).to.be.true
        expect(workingState.validationError).to.be.null
        expect(workingState.out.token).to.equal('BETA')
        expect(workingState.in.token).to.equal('XCP')
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


function buildSetSwapAndBotAction() {
    return {
        type: c.CHOOSE_SWAP_OBJECT,
        bot: { name: 'My Bot', balances: {TOKENLY: 100} },
        swapObject: swapObjectGenerator.rateSellConfig()
    };
}
