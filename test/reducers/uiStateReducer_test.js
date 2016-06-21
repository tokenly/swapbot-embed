import { expect } from '../test_helper';
import uiStateReducer from '../../src/reducers/uiState'
import c from '../../src/constants'
import deepFreeze from '../../node_modules/deep-freeze'


describe('UI State Reducer' , () => {
    it('sets the step', () => {
        let stateBefore = {}
        let action = {type: c.UI_GO_TO_STEP, step: 'EnterAmount'}
        deepFreeze(stateBefore);
        deepFreeze(action);

        let newState = uiStateReducer(stateBefore, action)

        expect(newState.step).to.equal('EnterAmount')
    })


});
