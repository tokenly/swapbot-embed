import { expect } from '../test_helper';
import api from '../../src/lib/api';
import swapbotApi from '../../src/lib/swapbotApi';
import sinon from '../../node_modules/sinon';
import mockSwapbotAPI from '../testHelpers/mockSwapbotAPI';
import SwapObject from '../../src/lib/api/SwapObject'

describe('API' , () => {
    let httpRequest;

    before(()=>{
        httpRequest = sinon.stub(swapbotApi, 'sendHttpRequest', mockSwapbotAPI.buildSendHttpRequestMock());
    });
    after(()=>{
        swapbotApi.sendHttpRequest.restore();
    });

    it('requires a client id', () => {
        let error;
        try {
            api.init();
        } catch (e) {
            error = e;
        }
        expect(''+error).to.equal('Error: A clientId is required to connect to the swapbot API.');
    })

    it('loads an array of swaps', () => {
        api.init({clientId: 'foo'});
        let waitingPromise = api.getSwaps().then((swapObjects)=>{
            expect(swapObjects).to.be.an('array');
        });
        
        return waitingPromise;  // returning a Promise makes mocha wait for a response
    })

    it('wraps swaps in a SwapObject', () => {
        api.init({clientId: 'foo'});
        let waitingPromise = api.getSwaps().then((swapObjects)=>{
            expect(swapObjects[0]).to.be.instanceof(SwapObject);
        });
        return waitingPromise;
    })

});
