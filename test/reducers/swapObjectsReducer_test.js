import { expect }          from '../test_helper';
import swapObjectsReducer  from '../../src/reducers/swapObjects'
import c                   from '../../src/constants/index'
import deepFreeze          from '../../node_modules/deep-freeze'
import swapObjectGenerator from '../testHelpers/swapObjectGenerator'

describe('Swap Objects Reducer' , () => {
    it('uses constants', () => {
        expect(c.SET_POSSIBLE_SWAP_OBJECTS).to.equal('SET_POSSIBLE_SWAP_OBJECTS');
    })

    it('sets the swap objects', () => {
        let stateBefore = {}
        deepFreeze(stateBefore)
        let newState = swapObjectsReducer(stateBefore, {type: c.SET_POSSIBLE_SWAP_OBJECTS, swapObjects: swapObjectGenerator.alphaAndBetaArray()})
        expect(newState).to.be.array
        expect(newState[0].swap.out).to.equal('ALPHA')
        expect(newState[1].swap.out).to.equal('BETA')
    })

    it('requires the action constant', () => {
        let newState = swapObjectsReducer({}, {type: 'OTHER', swapObjects: {in: 'BTC'}})
        expect(newState).to.be.empty
    })

});
