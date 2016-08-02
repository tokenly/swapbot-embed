import request from 'superagent';

let swapbotApi = {}

let API_PREFIX = '/api/v1';

let apiOpts = {connectionUrl: null};

swapbotApi.connect = function(connectionUrl) {
    apiOpts = {connectionUrl: connectionUrl};
}

swapbotApi.loadSwaps = function(parameters) {
    checkConnection();

    let filteredParameters = {}
    parameters = parameters || {};

    for (var allowedOpt of ['clientId', 'inToken','outToken','sort','userName','botId']) {
        if (parameters[allowedOpt] != null) {
            let value = parameters[allowedOpt];

            if (isArrayableParam(allowedOpt) && isArray(value)) {
                value = arrayToArrayParamString(value);
            }

            filteredParameters[allowedOpt] = value;
        }
    }
    return swapbotApi.sendRequest(apiOpts, 'GET', '/public/availableswaps', filteredParameters);
};

swapbotApi.getSwapsByBotId = (botId, parameters=null, limit=null) => {
    checkConnection();

    parameters = parameters || {};
    if (isArray(parameters.state)) {
        parameters.state = arrayToArrayParamString(parameters.state);
    }

    if (limit != null) { parameters.limit = limit; }
    return swapbotApi.sendRequest(apiOpts, 'GET', '/public/swaps/'+botId, parameters);
}

swapbotApi.getSwapsstreamEventsByBotId = (botId, limit=25) => {
    checkConnection();

    let parameters = {};
    parameters.sort = 'serial desc';
    if (limit != null) { parameters.limit = limit; }
    // $.get "/api/v1/public/swapevents/#{botId}?latestperswap=1&limit=#{limit}&sort=serial desc"

    return swapbotApi.sendRequest(apiOpts, 'GET', '/public/swapevents/'+botId, parameters);
}

swapbotApi.submitCustomerEmail = (swapId, email, level=0) => {
    checkConnection();

    let parameters = {
        swapId,
        email,
        level,
    };

    return swapbotApi.sendRequest(apiOpts, 'POST', '/public/customers', parameters);
}

// ------------------------------------------------------------------------

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
                let parsedResponse = swapbotApi.parseAPIResponse(res)
                if (parsedResponse != null && parsedResponse.message != null) {
                    reject(parsedResponse.message);
                    return;
                }

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

// ------------------------------------------------------------------------

const arrayable = {
    botId:    true,
    inToken:  true,
    outToken: true
}
const isArrayableParam = (param) => { return arrayable[param] != null; }
const isArray = (value) => { return (value && Array === value.constructor); }
const arrayToArrayParamString = (value) => { return value.join(','); }

// ------------------------------------------------------------------------

function checkConnection() {
    if (apiOpts.connectionUrl == null) {
        throw new Error("connection is undefined");
    }
}

// ------------------------------------------------------------------------

export default swapbotApi;
