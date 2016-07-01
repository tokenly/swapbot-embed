import swapbotApi from '../swapbotApi';
import SwapObject from './SwapObject';
import SwapUI     from './SwapUI';
import pockets    from '../util/pockets';

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

    pockets.appendPocketsMarkupToPage();
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

api.showSwapUI = function(domElement, swapObjects, options) {
    checkSwapbotConnection();

    let isValid = false;
    if (Array.isArray(swapObjects) && (swapObjects[0] instanceof SwapObject)) {
        isValid = true;
    } else if (swapObjects instanceof SwapObject) {
        swapObjects = [swapObjects];
        isValid = true;
    }

    if (!isValid) {
        throw new Error("You must pass SwapObject objects to the showSwapUI method")
    }

    SwapUI.show(domElement, swapObjects, options);
};

api.SwapObject = SwapObject;

function checkSwapbotConnection() {
    if (swapbotApiConnection == null) {
        throw new Error("Initialize the SwapbotAPI with SwapbotAPI.init() before calling this method");
    }
}



export default api;
