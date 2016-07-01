import { expect }          from '../test_helper';
import desiredSwapReducer  from '../../src/reducers/desiredSwap'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapObjectGenerator from '../testHelpers/swapObjectGenerator'

describe('Desired Swap Reducer for Fixed Swaps' , () => {
    it('sets the in and out quantity and token', () => {
        let stateBefore = setup();
        let action = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.validationError).to.be.null
        expect(newState.isValid).to.be.true
        expect(newState.in.token).to.equal('COAL')
        expect(newState.in.quantity).to.equal('8')
        expect(newState.out.quantity).to.equal(4)
        expect(newState.out.token).to.equal('CRYSTALS')
    })


    it('catches 0 out.quantity', () => {
        let stateBefore = setup();
        let action = buildSetOutTokenQuantityAction();
        action.quantity = 0;
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.quantity).to.equal(0)
        expect(newState.isValid).to.be.false
        expect(newState.validationError).to.equal('Amount must be a number greater than 0')
    })

    it('catches out.quantity Errors', () => {
        let stateBefore = setup();
        let action = buildSetOutTokenQuantityAction({quantity: 'bad'});
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.quantity).to.equal('bad')
        expect(newState.isValid).to.be.false
    })

    it('catches quantity too large Errors', () => {
        let stateBefore = setup();
        let action = buildSetOutTokenQuantityAction({quantity: 300});
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.quantity).to.equal(300)
        expect(newState.isValid).to.be.false
        expect(newState.validationError).to.equal('There is not enough CRYSTALS in stock to complete this swap.')
    })

    it('catches inexact quantity errors', () => {
        let stateBefore = setup({in_qty: 4, out_qty: 2,});
        let action = buildSetOutTokenQuantityAction({quantity: 1});
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.isValid).to.be.false
        expect(newState.validationError).to.contain('2 CRYSTALS for every 4 COAL.')
    })

});

// ------------------------------------------------------------------------

function setup(configOverrides={}) {
    let state = {};
    state = dispatchSetSwapObjects(state, configOverrides);
    state = dispatchSetOutToken(state);
    return state;
}

function dispatchSetSwapObjects(state={}, configOverrides={}) {
    return desiredSwapReducer(state, buildSetSwapObjectsAction(configOverrides));
}
function dispatchSetOutToken(state={}, token='CRYSTALS') {
    return desiredSwapReducer(state, buildSetOutTokenAction({token: token}));
}


function buildSetOutTokenAction(action={}) {
    return {
        type:  c.INPUT_SET_OUT_TOKEN,
        token: 'CRYSTALS',
        ...action
    };
}

function buildSetOutTokenQuantityAction(action={}) {
    return {
        type:     c.INPUT_SET_OUT_TOKEN_QUANTITY,
        quantity: 4,
        ...action
    };
}

function buildSetSwapObjectsAction(configOverrides={}) {
    return {
        type:        c.SET_POSSIBLE_SWAP_OBJECTS,
        swapObjects: [swapObjectGenerator.fixedConfig(configOverrides)],
    };
}
