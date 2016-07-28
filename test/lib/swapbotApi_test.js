import { expect } from '../test_helper';
import swapbotApi from '../../src/lib/swapbotApi';
import sinon from '../../node_modules/sinon';


describe('swapbotApi' , () => {
    let httpRequest = null;

    before(()=>{
        swapbotApi.connect('http://foo.bar');
        httpRequest = sinon.stub(swapbotApi, 'sendHttpRequest');
    });

    it('loads swaps', () => {
        swapbotApi.loadSwaps();
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
            swapbotApi.loadSwaps(validQuery);
            sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', validQuery);
            httpRequest.reset();
        }
    });

    it('transforms an array of botId to a comma separated list', () => {
        let queryParams = {clientId: 'client0001', botId: ['bot001','bot002']};
        let expectedQueryParams = {clientId: 'client0001', botId: 'bot001,bot002'};
        swapbotApi.loadSwaps(queryParams);
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', expectedQueryParams);
        httpRequest.reset();
    });

    it('transforms an array of inToken to a comma separated list', () => {
        let queryParams = {clientId: 'client0001', inToken: ['BTC','XCP']};
        let expectedQueryParams = {clientId: 'client0001', inToken: 'BTC,XCP'};
        swapbotApi.loadSwaps(queryParams);
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', expectedQueryParams);
        httpRequest.reset();

        queryParams = {clientId: 'client0001', inToken: ['BTC']};
        expectedQueryParams = {clientId: 'client0001', inToken: 'BTC'};
        swapbotApi.loadSwaps(queryParams);
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', expectedQueryParams);
        httpRequest.reset();
    });

    it('transforms an array of outToken to a comma separated list', () => {
        let queryParams = {clientId: 'client0001', outToken: ['FOOCOIN','BARCOIN']};
        let expectedQueryParams = {clientId: 'client0001', outToken: 'FOOCOIN,BARCOIN'};
        swapbotApi.loadSwaps(queryParams);
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', expectedQueryParams);
        httpRequest.reset();
    });

    it('transforms an array of inToken and outToken to a comma separated list', () => {
        let queryParams = {clientId: 'client0001', outToken: ['FOOCOIN','BARCOIN'], inToken: ['BTC','XCP']};
        let expectedQueryParams = {clientId: 'client0001', outToken: 'FOOCOIN,BARCOIN', inToken: 'BTC,XCP'};
        swapbotApi.loadSwaps(queryParams);
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', expectedQueryParams);
        httpRequest.reset();
    });

    it('does not pass an invalid query var', () => {
        swapbotApi.loadSwaps({iAmSoInvalid: 'foo'});
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/availableswaps', {});
    });

    it('loads swap events', () => {
        swapbotApi.getSwapsByBotId('12345');
        sinon.assert.calledWith(httpRequest, 'GET', 'http://foo.bar/api/v1/public/swaps/12345');
    });


    after(()=>{
        swapbotApi.sendHttpRequest.restore();
    });

});
