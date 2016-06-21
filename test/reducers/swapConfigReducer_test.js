import { expect } from '../test_helper';
import swapConfigReducer from '../../src/reducers/swapConfig'
import c from '../../src/constants/index'
import deepFreeze from '../../node_modules/deep-freeze'


describe('Swap Config Reducer' , () => {
    it('uses constants', () => {
        expect(c.SET_SWAP_AND_BOT).to.equal('SET_SWAP_AND_BOT');
    })

    it('sets the swap config', () => {
        let stateBefore = {}
        deepFreeze(stateBefore)
        let newState = swapConfigReducer(stateBefore, {type: c.SET_SWAP_AND_BOT, swapConfig: {in: 'BTC'}})
        expect(newState.in).to.equal('BTC')
    })

    it('requires the action constant', () => {
        let newState = swapConfigReducer({}, {type: 'OTHER', swapConfig: {in: 'BTC'}})
        expect(newState).to.be.empty
    })

});
