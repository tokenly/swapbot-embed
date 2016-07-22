import { expect } from '../test_helper';
import c          from '../../src/constants'

let stateChecker = {}


stateChecker.checkSwap = (state, expectations)=>{
    let [expectedOutQantity, expectedOutToken, expectedInQantity, expectedInToken] = expectations;

    stateChecker.checkSwapIsValid(state)

    expect(state.out.quantity).to.equal(expectedOutQantity, 'The out quantity did not match')
    expect(state.out.token)   .to.equal(expectedOutToken,   'The out token did not match')
    expect(state.in.quantity) .to.equal(expectedInQantity,  'The in quantity did not match')
    expect(state.in.token)    .to.equal(expectedInToken,    'The in token did not match')

}

stateChecker.checkSwapIsValid = (state)=>{
    expect(state.validationError).to.be.null
    expect(state.isValid).to.be.true

}

export default stateChecker;