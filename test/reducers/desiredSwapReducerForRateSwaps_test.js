import { expect }          from '../test_helper';
import desiredSwapReducer  from '../../src/reducers/desiredSwap'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapObjectGenerator from '../testHelpers/swapObjectGenerator'

describe('Desired Swap Reducer for Rate Swaps' , () => {
    it('sets the in and out quantity', () => {
        let stateBefore = setup();
        let action = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.in.token).to.equal('BTC')
        expect(newState.in.quantity).to.equal('0.2')
        expect(newState.out.token).to.equal('TOKENLY')
        expect(newState.out.quantity).to.equal(10)
        expect(newState.validationError).to.be.null
        expect(newState.isValid).to.be.true
    })

    it('sets the out token', () => {
        let stateBefore = {}
        let action = buildSetOutTokenAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.token).to.equal('TOKENLY')
    })

    it('retains the out token when quantity is updated', () => {
        let stateBefore = {}
        let action = buildSetOutTokenAction();
        deepFreeze(stateBefore);
        deepFreeze(action);
        let newState = desiredSwapReducer(stateBefore, action)
        expect(newState.out.token).to.equal('TOKENLY')

        let stateBefore_step2 = {...newState};
        let action_step2 = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore_step2);
        deepFreeze(action_step2);
        let newState_step2 = desiredSwapReducer(stateBefore_step2, action_step2)
        expect(newState_step2.validationError).to.be.null
        expect(newState_step2.out.quantity).to.equal(10)
        expect(newState_step2.out.token).to.equal('TOKENLY')

    })

    // it('sets the in values', () => {
    //     let stateBefore = {}
    //     let action = buildSetSwapObjectsAction();
    //     deepFreeze(stateBefore);
    //     deepFreeze(action);

    //     let newState = desiredSwapReducer(stateBefore, action)

    //     expect(newState.in.token).to.equal('BTC')
    //     expect(newState.in.quantity).to.equal(0)
    // })

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
        let action = buildSetOutTokenQuantityAction();
        action.quantity = 'bad';
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.quantity).to.equal('bad')
        expect(newState.isValid).to.be.false
    })

    it('catches quantity too large Errors', () => {
        let stateBefore = setup();
        let action = buildSetOutTokenQuantityAction();
        action.quantity = 300;
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.quantity).to.equal(300)
        expect(newState.isValid).to.be.false
        expect(newState.validationError).to.equal('There is not enough TOKENLY in stock to complete this swap.')
    })


});

// ------------------------------------------------------------------------

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
        swapObjects: [swapObjectGenerator.rateSellConfig(configOverrides)],
    };
}
