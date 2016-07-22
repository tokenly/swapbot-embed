import { expect } from '../test_helper';
import swapbotApi from '../../src/lib/swapbotApi';
import sinon from '../../node_modules/sinon';


describe('swapbotApi' , () => {
    let swapbotConnection = swapbotApi.connect('http://foo.bar');
    let httpRequest = null;

    before(()=>{
        httpRequest = sinon.stub(swapbotApi, 'sendHttpRequest');
    });

    it('loads swaps', () => {
        swapbotConnection.loadSwaps();
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps');
    });

    it('loads swaps with query vars', () => {
        let allValidQueries = [
            {clientId: 'client0001', inToken: 'BTC'},
            {clientId: 'client0001', outToken: 'TOKENLY', inToken: 'BTC'},
            {clientId: 'client0001', sort: 'cost'},
            {clientId: 'client0001', userName: 'foobar'},
            {clientId: 'client0001', botId: 'xxxxxxx'},
        ];

        for (var validQuery of allValidQueries) {
            swapbotConnection.loadSwaps(validQuery);
            sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', validQuery);
            httpRequest.reset();
        }
    });

    it('transforms an array of botId to a comma separated list', () => {
        let queryParams = {clientId: 'client0001', botId: ['bot001','bot002']};
        let expectedQueryParams = {clientId: 'client0001', botId: 'bot001,bot002'};
        swapbotConnection.loadSwaps(queryParams);
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', expectedQueryParams);
        httpRequest.reset();
    });

    it('transforms an array of inToken to a comma separated list', () => {
        let queryParams = {clientId: 'client0001', inToken: ['BTC','XCP']};
        let expectedQueryParams = {clientId: 'client0001', inToken: 'BTC,XCP'};
        swapbotConnection.loadSwaps(queryParams);
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', expectedQueryParams);
        httpRequest.reset();

        queryParams = {clientId: 'client0001', inToken: ['BTC']};
        expectedQueryParams = {clientId: 'client0001', inToken: 'BTC'};
        swapbotConnection.loadSwaps(queryParams);
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', expectedQueryParams);
        httpRequest.reset();
    });

    it('transforms an array of outToken to a comma separated list', () => {
        let queryParams = {clientId: 'client0001', outToken: ['FOOCOIN','BARCOIN']};
        let expectedQueryParams = {clientId: 'client0001', outToken: 'FOOCOIN,BARCOIN'};
        swapbotConnection.loadSwaps(queryParams);
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', expectedQueryParams);
        httpRequest.reset();
    });

    it('transforms an array of inToken and outToken to a comma separated list', () => {
        let queryParams = {clientId: 'client0001', outToken: ['FOOCOIN','BARCOIN'], inToken: ['BTC','XCP']};
        let expectedQueryParams = {clientId: 'client0001', outToken: 'FOOCOIN,BARCOIN', inToken: 'BTC,XCP'};
        swapbotConnection.loadSwaps(queryParams);
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', expectedQueryParams);
        httpRequest.reset();
    });

    it('does not pass an invalid query var', () => {
        swapbotConnection.loadSwaps({iAmSoInvalid: 'foo'});
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', {});
    });

    after(()=>{
        swapbotApi.sendHttpRequest.restore();
    });

});
