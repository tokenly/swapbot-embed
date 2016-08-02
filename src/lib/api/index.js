import swapbotApi from '../swapbotApi';
import SwapObject from './SwapObject';
import SwapUI     from './SwapUI';
import pockets    from '../util/pockets';

let api = {}

let connectionUrl;
let clientId = null;

let swapbotApiConnected = false;

api.init = function(options) {
    options = options || {};

    connectionUrl = options.host || 'https://swapbot.tokenly.com';

    clientId = options.clientId;
    if (clientId == null) {
        throw new Error("A clientId is required to connect to the swapbot API.");
    }
    swapbotApi.connect(connectionUrl)
    swapbotApiConnected = true;

    pockets.appendPocketsMarkupToPage();
}

api.getSwaps = function(parameters, callback=null) {
    checkSwapbotConnection();
    return swapbotApi.loadSwaps(parameters).then((rawSwapObjects) => {
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
    let publicError, consoleError;

    if (swapObjects instanceof SwapObject) {
        swapObjects = [swapObjects];
    }

    if (Array.isArray(swapObjects)) {
        isValid = true;

        if (isValid && swapObjects.length < 1) {
            isValid = false;
            publicError = "No swaps were found for this search."
            consoleError = "You must pass objects of type SwapObject to the showSwapUI method"
        }

        if (isValid && !(swapObjects[0] instanceof SwapObject)) {
            isValid = false;
            publicError = "Invalid swaps were found."
            consoleError = "Only objects of type SwapObject may be passed to the showSwapUI method"
        }

    } else {
        isValid = false;
        publicError = "Invalid swaps found"
        consoleError = "You must pass an array of SwapObject objects to the showSwapUI method"
    }

    if (!isValid) {
        console.error(consoleError);
        SwapUI.showError(domElement, publicError);
        return;
    }

    SwapUI.show(domElement, swapObjects, options);
};

api.SwapObject = SwapObject;

function checkSwapbotConnection() {
    if (swapbotApiConnected == false) {
        throw new Error("Initialize the SwapbotAPI with SwapbotAPI.init() before calling this method");
    }
}



export default api;
