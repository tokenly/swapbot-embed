import { expect } from '../test_helper';
import reducers from '../../src/reducers'
import c from '../../src/constants/index'
import deepFreeze from '../../node_modules/deep-freeze'


describe('RootReducer' , () => {
    it('sets the step on uiState key', () => {
        let stateBefore = {}
        let action = {type: c.UI_GO_TO_STEP, step: 1};
        deepFreeze(action);
        deepFreeze(stateBefore);
        let newState = reducers(stateBefore, action);
        expect(newState.uiState.step).to.equal(1);
    })
});
