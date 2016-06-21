import { expect }         from '../test_helper';
import c                  from '../../src/constants/index'
import deepFreeze         from '../../node_modules/deep-freeze'
import desiredSwapReducer from '../../src/reducers/desiredSwap'


describe('Swap Config Reducer for Quotes' , () => {
    it('sets the quote', () => {
        let stateBefore = null;
        let action = {
            type:   c.SET_QUOTES,
            quotes: {foo: 'bar'},
        }
        deepFreeze(action);

        let newState = desiredSwapReducer(stateBefore, action)

        expect(newState.quotes.foo).to.equal('bar');
    })

    it('updates the quote', () => {
        let action = {
            type:   c.SET_QUOTES,
            quotes: {'bitcoinAverage.USD:BTC': {last: 100}},
        }
        deepFreeze(action);
        let stateBefore = desiredSwapReducer(null, action)
        expect(stateBefore.quotes['bitcoinAverage.USD:BTC'].last).to.equal(100);

        let action2 = {
            type:   c.UPDATE_QUOTE,
            quote: {source: 'bitcoinAverage', pair: 'USD:BTC', last: 101},
        }
        deepFreeze(stateBefore);
        deepFreeze(action2);

        let stateAfter = desiredSwapReducer(stateBefore, action2)
        expect(stateAfter.quotes['bitcoinAverage.USD:BTC'].last).to.equal(101);
    })

});
