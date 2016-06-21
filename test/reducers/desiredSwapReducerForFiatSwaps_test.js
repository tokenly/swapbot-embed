import { expect }          from '../test_helper';
import desiredSwapReducer  from '../../src/reducers/desiredSwap'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapConfigGenerator from '../testHelpers/swapConfigGenerator'
import quoteGenerator      from '../testHelpers/quoteGenerator'

describe('Desired Swap Reducer for Fiat Swaps' , () => {
    it('sets the in and out quantity and token', () => {
        let stateBefore = dispatchSetSwapAndBotActionWithQuote();
        let action = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.validationError).to.be.null
        expect(newState.out.isValid).to.be.true
        expect(newState.out.quantity).to.equal(2)
        expect(newState.out.token).to.equal('TOKENLY')
        expect(newState.in.token).to.equal('BTC')
        expect(newState.in.quantity).to.equal(0.04)
    })

    it('handles missing quote', () => {
        let stateBefore = dispatchSetSwapAndBotAction();
        let action = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.validationError).to.contain('Waiting on USD quote for BTC')
        expect(newState.in.quantity).to.equal(0)
        expect(newState.in.isValid).to.be.false
    })

    it('catches 0 out.quantity', () => {
        let stateBefore = dispatchSetSwapAndBotActionWithQuote();
        let action = buildSetOutTokenQuantityAction();
        action.quantity = 0;
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.quantity).to.equal(0)
        expect(newState.out.isValid).to.be.false
        expect(newState.out.validationError).to.equal('Amount must be a number greater than 0')
    })

    it('catches out.quantity Errors', () => {
        let stateBefore = dispatchSetSwapAndBotActionWithQuote();
        let action = buildSetOutTokenQuantityAction({quantity: 'bad'});
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.quantity).to.equal('bad')
        expect(newState.out.isValid).to.be.false
    })

    it('catches quantity too large Errors', () => {
        let stateBefore = dispatchSetSwapAndBotActionWithQuote();
        let action = buildSetOutTokenQuantityAction({quantity: 300});
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.quantity).to.equal(300)
        expect(newState.out.isValid).to.be.false
        expect(newState.out.validationError).to.equal('There is not enough TOKENLY in stock to complete this swap.')
    })

});

function dispatchSetSwapAndBotAction(fixedConfigOverrides={}) {
    return desiredSwapReducer({}, buildSetSwapAndBotAction(fixedConfigOverrides));
}

function dispatchSetSwapAndBotActionWithQuote(fixedConfigOverrides={}, quoteOverrides={}) {
    let state = desiredSwapReducer({}, buildSetQuoteAction(quoteOverrides));
    return desiredSwapReducer(state, buildSetSwapAndBotAction(fixedConfigOverrides));
}

function buildSetQuoteAction(quoteOverrides={}) {
    let quotes = quoteGenerator.buildBTCQuote(quoteOverrides);
    return {
        type:   c.SET_QUOTES,
        quotes: quotes,
    };
}

function buildSetOutTokenQuantityAction(action={}) {
    return {
        type:     c.INPUT_SET_OUT_TOKEN_QUANTITY,
        quantity: 2,
        ...action
    };
}

function buildSetSwapAndBotAction(fixedConfigOverrides={}) {
    return {
        type: c.SET_SWAP_AND_BOT,
        bot: { name: 'My Bot', balances: {TOKENLY: 100} },
        swapConfig: swapConfigGenerator.fiatSellConfig(fixedConfigOverrides),
    };
}
