import swapbotApi from '../swapbotApi';
import SwapObject from './SwapObject';
import SwapUI from './SwapUI';

let api = {}

let connectionUrl = 'https://swapbot-stage.tokenly.com';
let clientId = null;

let swapbotApiConnection = null;

api.init = function(options) {
    options = options || {};

    clientId = options.clientId;
    if (clientId == null) {
        throw new Error("A clientId is required to connect to the swapbot API.");
    }
    swapbotApiConnection = swapbotApi.connect(connectionUrl)
}

api.getSwaps = function(parameters, callback=null) {
    checkSwapbotConnection();
    return swapbotApiConnection.loadSwaps(parameters).then((rawSwapObjects) => {
        let out = [];
        for (var rawSwapObject of rawSwapObjects) {
            out.push(new SwapObject(rawSwapObject));
        }

        if (callback != null) {
            callback(out);
        }

        return out;
    });
};

api.showSwapUI = function(domElement, swapObject, options) {
    checkSwapbotConnection();
    if (!(swapObject instanceof SwapObject)) {
        throw new Error("You must pass a SwapObject to the showSwapUI method")
    }
    SwapUI.show(domElement, swapObject, options);
};

api.SwapObject = SwapObject;

function checkSwapbotConnection() {
    if (swapbotApiConnection == null) {
        throw new Error("Initialize the SwapbotAPI with SwapbotAPI.init() before calling this method");
    }
}



export default api;
