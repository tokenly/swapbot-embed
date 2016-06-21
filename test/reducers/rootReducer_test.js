import { expect } from '../test_helper';
import reducers from '../../src/reducers'
import c from '../../src/constants/index'
import deepFreeze from '../../node_modules/deep-freeze'


describe('RootReducer' , () => {
    it('sets the swap config on the swap key', () => {
        let stateBefore = {}
        let action = {type: c.SET_SWAP_AND_BOT, swapConfig: {in: 'BTC', out: 'TOKENLY'}, bot: {name: 'Foo Bot', address: '1xxxxxxxxxx'}};
        deepFreeze(action);
        deepFreeze(stateBefore);
        let newState = reducers(stateBefore, action);
        expect(newState.swapConfig.in).to.equal('BTC');
        expect(newState.swapConfig.out).to.equal('TOKENLY');
    })
});
