import { expect }          from '../test_helper';
import desiredSwapReducer  from '../../src/reducers/desiredSwap'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapObjectGenerator from '../testHelpers/swapObjectGenerator'
import quoteGenerator      from '../testHelpers/quoteGenerator'

describe('Desired Swap Reducer for Fiat Swaps' , () => {
    it('sets the in and out quantity and token', () => {
        let stateBefore = setup();
        let action = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.validationError).to.be.null
        expect(newState.isValid).to.be.true
        expect(newState.out.quantity).to.equal(2)
        expect(newState.out.token).to.equal('TOKENLY')
        expect(newState.in.token).to.equal('BTC')
        expect(newState.in.quantity).to.equal('0.04')
    })

    it('sets the out quantity from in quantity', () => {
        let stateBefore = setup();
        let action = buildSetOutTokenQuantityAction();
        let newState = desiredSwapReducer(stateBefore, action)

        newState = desiredSwapReducer(stateBefore, buildSetInTokenQuantityAction())

        // BTC is $500 USD.  1 TOKENLY costs $10 (or 0.02 BTC)
        //   we are sending 0.08 BTC ($40).  We should receive 4 TOKENLY
        expect(newState.validationError).to.be.null
        expect(newState.isValid).to.be.true
        expect(newState.out.token).to.equal('TOKENLY')
        expect(newState.in.token).to.equal('BTC')
        expect(newState.out.quantity).to.equal('4')
        expect(newState.in.quantity).to.equal(0.08)
    })

    it('handles missing quote', () => {
        let stateBefore = dispatchSetSwapObjects();
        let action = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.validationError).to.contain('Waiting on USD quote for BTC')
        expect(newState.in.quantity).to.equal('')
        expect(newState.isValid).to.be.false
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
        expect(newState.validationError).to.equal('There is not enough TOKENLY in stock to complete this swap.')
    })

});

// ------------------------------------------------------------------------

function setup() {
    let state = {};
    state = dispatchSetQuote(state);
    state = dispatchSetSwapObjects(state);
    state = dispatchSetOutToken(state);
    return state;
}

function dispatchSetSwapObjects(state={}) {
    return desiredSwapReducer(state, buildSetSwapObjectsAction());
}
function dispatchSetQuote(state={}, quoteOverrides={}) {
    return desiredSwapReducer(state, buildSetQuoteAction(quoteOverrides));
}
function dispatchSetOutToken(state={}, token='TOKENLY') {
    return desiredSwapReducer(state, buildSetOutTokenAction({token: token}));
}

function buildSetQuoteAction(quoteOverrides={}) {
    let quotes = quoteGenerator.buildBTCQuote(quoteOverrides);
    return {
        type:   c.SET_QUOTES,
        quotes: quotes,
    };
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
        quantity: 2,
        ...action
    };
}

function buildSetInTokenQuantityAction(action={}) {
    return {
        type:     c.INPUT_SET_IN_TOKEN_QUANTITY,
        quantity: 0.08,
        ...action
    };
}

function buildSetSwapObjectsAction(configOverrides={}) {
    return {
        type:        c.SET_POSSIBLE_SWAP_OBJECTS,
        swapObjects: [swapObjectGenerator.fiatSellConfig(configOverrides)],
    };
}
