import { expect }           from '../test_helper';
import matchedSwapReducer   from '../../src/reducers/matchedSwap'
import c                    from '../../src/constants'
import actions              from '../../src/actions'
import deepFreeze           from '../../node_modules/deep-freeze'
import swapstreamHelper     from '../testHelpers/swapstreamHelper'
import desiredSwapGenerator from '../testHelpers/desiredSwapGenerator'


describe('Matched Swap Reducer' , () => {
    it('sets the desired swap', () => {
        let stateBefore = {}
        let action = desiredSwapGenerator.buildSetDesiredSwapAction(1, 'TOKENLY', 0.01, 'BTC');
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = matchedSwapReducer(stateBefore, action)
        expect(newState.desiredSwap.in.token).to.equal('BTC')
        expect(newState.desiredSwap.in.quantity).to.equal('0.02')
        expect(newState.desiredSwap.out.token).to.equal('TOKENLY')
        expect(newState.desiredSwap.out.quantity).to.equal(1)
    })

    it('clears the desired swap', () => {
        let stateBefore = {}
        let action = desiredSwapGenerator.buildSetDesiredSwapAction(1, 'TOKENLY', 0.01, 'BTC');
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = matchedSwapReducer(stateBefore, action)
        expect(newState.desiredSwap.in.token).to.equal('BTC')

        newState = matchedSwapReducer(newState, actions.clearDesiredSwapstreamSwap())
        expect(newState.desiredSwap).to.be.null

    })

    it('chooses my swap', () => {
        let stateBefore = {}
        let action = desiredSwapGenerator.buildSetDesiredSwapAction(1, 'TOKENLY', 0.01, 'BTC');
        deepFreeze(stateBefore);
        deepFreeze(action);
        let state = matchedSwapReducer(stateBefore, action)

        // apply a possible swap
        state = swapstreamHelper.applySwapstreamEventsForPossibleSwap(state);
        expect(state.possibleMatchedSwapsArray).to.be.array
        expect(state.possibleMatchedSwapsArray[0].assetIn).to.equal('BTC')
        let swap = state.possibleMatchedSwapsArray[0];

        // choose a swap
        state = matchedSwapReducer(state, actions.chooseMySwap(swap))
        expect(state.matchedSwap).to.be.object
        expect(state.matchedSwap.assetIn).to.equal('BTC')
        expect(state.matchedSwap.quantityIn).to.equal(0.025)
        expect(state.matchedSwap.assetOut).to.equal('TOKENLY')
    })

    it('ignores a swap', () => {
        let stateBefore = {}
        let action = desiredSwapGenerator.buildSetDesiredSwapAction(1, 'TOKENLY', 0.01, 'BTC');
        deepFreeze(stateBefore);
        deepFreeze(action);
        let state = matchedSwapReducer(stateBefore, action)

        // apply two possible swaps
        state = swapstreamHelper.applySwapstreamEventsForPossibleSwap(state);
        state = swapstreamHelper.applySwapstreamEventsForPossibleSwap(state, 2);
        expect(state.possibleMatchedSwapsArray).to.have.length(2)

        // ignore one of the swaps
        let oldId = state.possibleMatchedSwapsArray[0].id;
        state = matchedSwapReducer(state, actions.ignoreSwap(state.possibleMatchedSwapsArray[1]))
        expect(state.possibleMatchedSwapsArray).to.have.length(1)
        expect(state.possibleMatchedSwapsArray[0].id).to.equal(oldId)
    })

    it('respects serial when applying events', () => {
        // build a desired swap
        let action = desiredSwapGenerator.buildSetDesiredSwapAction(1, 'TOKENLY', 0.01, 'BTC');
        let state = matchedSwapReducer({}, action)

        // apply a swapstream event with 1 transactions
        state = swapstreamHelper.applySwapstreamEventsForPossibleSwap(state, 1, {confirmations: "1"}, {serial: 1469662005000});

        // apply a swapstream event with 0 transactions, but with an earlier serial number
        state = swapstreamHelper.applySwapstreamEventsForPossibleSwap(state, 1, {confirmations: "0"}, {serial: 1469662000000});
        
        // make sure the possible matched swap is still 1 transaction
        expect(state.possibleMatchedSwapsArray).to.have.length(1)
        let mergedSwap = state.possibleMatchedSwapsArray[0];
        expect(mergedSwap.confirmations).to.equal('1')

    })


});
