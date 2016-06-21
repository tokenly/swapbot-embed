import { expect }          from '../test_helper';
import desiredSwapReducer  from '../../src/reducers/desiredSwap'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapConfigGenerator from '../testHelpers/swapConfigGenerator'

describe('Desired Swap Reducer for Rate Swaps' , () => {
    it('sets the in and out quantity', () => {
        let stateBefore = dispatchSetSwapAndBotAction();
        let action = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.in.token).to.equal('BTC')
        expect(newState.in.quantity).to.equal(0.2)
        expect(newState.out.token).to.equal('TOKENLY')
        expect(newState.out.quantity).to.equal(10)
        expect(newState.out.validationError).to.be.null
        expect(newState.out.isValid).to.be.true
    })

    it('sets the out token', () => {
        let stateBefore = {}
        let action = buildSetSwapAndBotAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.token).to.equal('TOKENLY')
    })

    it('retains the out token when quantity is updated', () => {
        let stateBefore = {}
        let action = buildSetSwapAndBotAction();
        deepFreeze(stateBefore);
        deepFreeze(action);
        let newState = desiredSwapReducer(stateBefore, action)
        expect(newState.out.token).to.equal('TOKENLY')

        let stateBefore_step2 = {...newState};
        let action_step2 = buildSetOutTokenQuantityAction();
        deepFreeze(stateBefore_step2);
        deepFreeze(action_step2);
        let newState_step2 = desiredSwapReducer(stateBefore_step2, action_step2)
        expect(newState_step2.out.token).to.equal('TOKENLY')
        expect(newState_step2.out.quantity).to.equal(10)

    })

    it('sets the in values', () => {
        let stateBefore = {}
        let action = buildSetSwapAndBotAction();
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.in.token).to.equal('BTC')
        expect(newState.in.quantity).to.equal(0)
    })

    it('catches 0 out.quantity', () => {
        let stateBefore = dispatchSetSwapAndBotAction();
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
        let stateBefore = dispatchSetSwapAndBotAction();
        let action = buildSetOutTokenQuantityAction();
        action.quantity = 'bad';
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.quantity).to.equal('bad')
        expect(newState.out.isValid).to.be.false
    })

    it('catches quantity too large Errors', () => {
        let stateBefore = dispatchSetSwapAndBotAction();
        let action = buildSetOutTokenQuantityAction();
        action.quantity = 300;
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.out.quantity).to.equal(300)
        expect(newState.out.isValid).to.be.false
        expect(newState.out.validationError).to.equal('There is not enough TOKENLY in stock to complete this swap.')
    })


});

function dispatchSetSwapAndBotAction() {
    return desiredSwapReducer({}, buildSetSwapAndBotAction());
}

function buildSetOutTokenQuantityAction() {
    return {
        type: c.INPUT_SET_OUT_TOKEN_QUANTITY,
        quantity: 10
    };
}

function buildSetSwapAndBotAction() {
    return {
        type: c.SET_SWAP_AND_BOT,
        bot: { name: 'My Bot', balances: {TOKENLY: 100} },
        swapConfig: swapConfigGenerator.rateSellConfig()
    };
}
