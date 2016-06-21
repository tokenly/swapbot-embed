import request from 'superagent';

let quotebotApi = {}

let API_PREFIX = '/api/v1';

quotebotApi.connect = function(connectionUrl, apiToken) {
    let apiOpts = {connectionUrl: connectionUrl, apiToken: apiToken};

    let connection = {};
    connection.getQuotes = function() {
        let params = {apitoken: apiOpts.apiToken}
        return quotebotApi.sendRequest(apiOpts, 'GET', '/quote/all', params);
    };

    // ------------------------------------------------------------------------
    
    return connection;
}


quotebotApi.sendRequest = function(apiOpts, method, urlPath, params) {
    return quotebotApi.sendHttpRequest(method, apiOpts.connectionUrl + API_PREFIX + urlPath, params);
};

quotebotApi.sendHttpRequest = function(method, fullUrl, params) {
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
                resolve(quotebotApi.parseAPIResponse(res));
            }
        });

    });
};

quotebotApi.parseAPIResponse = function(res) {
    let quotes = {}
    if (res.body != null && res.body.quotes != null) {
        for(var rawQuote of res.body.quotes) {
            quotes[rawQuote.source+'.'+rawQuote.pair] = rawQuote
        }
    }
    return quotes;
};

export default quotebotApi;
