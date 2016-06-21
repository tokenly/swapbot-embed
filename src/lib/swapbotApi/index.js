import request from 'superagent';

let swapbotApi = {}

let API_PREFIX = '/api/v1';

swapbotApi.connect = function(connectionUrl) {
    let apiOpts = {connectionUrl: connectionUrl};

    let connection = {};

    connection.loadSwaps = function(parameters) {
        let filteredParameters = {}
        parameters = parameters || {};
        for (var allowedOpt of ['clientId', 'inToken','outToken','sort','userName','botId']) {
            if (parameters[allowedOpt] != null) {
                filteredParameters[allowedOpt] = parameters[allowedOpt];
            }
        }
        return swapbotApi.sendRequest(apiOpts, 'GET', '/public/availableswaps', filteredParameters);
    };

    // ------------------------------------------------------------------------
    
    return connection;
}


swapbotApi.sendRequest = function(apiOpts, method, urlPath, params) {
    return swapbotApi.sendHttpRequest(method, apiOpts.connectionUrl + API_PREFIX + urlPath, params);
};

swapbotApi.sendHttpRequest = function(method, fullUrl, params) {
    return new Promise((resolve, reject) => {
        let req = request(method, fullUrl);
        if (params != null) {
            if (method == 'GET') {
                req.query(params);
            } else {
                req.send(params);
            }
        }
        req.end((error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(swapbotApi.parseAPIResponse(res));
            }
        });

    });
};

swapbotApi.parseAPIResponse = function(res) {
    // console.log('parseAPIResponse res.body:'+res);
    return res.body;
};

export default swapbotApi;
