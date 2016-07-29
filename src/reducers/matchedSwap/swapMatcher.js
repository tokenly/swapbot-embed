
let exports = {};

exports.extractSwapFromEvent = (swapstreamEvent) => {
    let newSwap = {
        ...swapstreamEvent.event
    }

    // use the message if it is not a debug message
    if (swapstreamEvent.level >= 200) {
        newSwap.message = swapstreamEvent.message
    } else {
        newSwap.debugMessage = swapstreamEvent.message
    }

    // ignore the name
    delete newSwap.name

    // pull the id, serial and updateAt from the event wrapper object
    newSwap.id = swapstreamEvent.swapUuid
    newSwap.serial = swapstreamEvent.serial
    newSwap.updatedAt = swapstreamEvent.createdAt

    // convert the completedAt timestamp to ms
    if (swapstreamEvent.event.completedAt != null) {
        newSwap.completedAt = swapstreamEvent.event.completedAt * 1000
    }

    return newSwap
}

exports.isPossibleSwapMatch = (possibleSwapConfig, actualDesiredSwap, ignoredSwapIds) => {
    if (!swapIsValid(possibleSwapConfig, ignoredSwapIds)) {
        return false;
    }

    if (actualDesiredSwap.in == null) { return null; }

    // console.log('actualDesiredSwap', actualDesiredSwap);
    // console.log('actualDesiredSwap.in.token', actualDesiredSwap.in.token);
    // console.log('actualDesiredSwap.in.quantity', actualDesiredSwap.in.quantity);
    // console.log('possibleSwapConfig.assetIn', possibleSwapConfig.assetIn);
    // console.log('possibleSwapConfig.quantityIn', possibleSwapConfig.quantityIn);
    if (possibleSwapConfig.assetIn == actualDesiredSwap.in.token) {
        let actualQuantity = actualDesiredSwap.in.quantity;
        if (possibleSwapConfig.quantityIn == actualQuantity) {
            return true
        }

        // look for a close amount in
        let PERCENT = 0.05;
        if (
            possibleSwapConfig.quantityIn >= actualQuantity - (actualQuantity * PERCENT)
            || possibleSwapConfig.quantityIn <= actualQuantity + (actualQuantity * PERCENT)
        ) {
            return true;
        }
    }

    console.log('isPossibleSwapMatch failed for '+possibleSwapConfig.quantityIn+' '+possibleSwapConfig.assetIn+'');
    return false;
}


exports.findAndMergeEventDataWithPossibleMatchedSwap = (swapEventData, allSwapConfigsMap) => {
    let oldSwapConfig = allSwapConfigsMap[swapEventData.id] || {};
    return exports.mergeSwapData(oldSwapConfig, swapEventData);
}

exports.mergePossibleMatchedSwap = (swapEventData, allSwapConfigsMap) => {
    let oldSwapConfig = allSwapConfigsMap[swapEventData.id] || {};

    allSwapConfigsMap[swapEventData.id] = exports.mergeSwapData(oldSwapConfig, swapEventData);

    return allSwapConfigsMap;
}

exports.removePossibleSwapById = (swapId, allSwapConfigs) => {
    if (allSwapConfigs[swapId] != null) {
        delete allSwapConfigs[swapId];
    }
    return allSwapConfigs;
}

exports.mergeSwapData = (oldSwapConfig, newSwapConfig) => {
    let oldSerial = oldSwapConfig.serial || 0;
    let newSerial = newSwapConfig.serial || 0;
    if (oldSerial > newSerial) {
        return {
            // oldSwapConfig is actually newer
            ...newSwapConfig,
            ...oldSwapConfig,
        };

    } else {
        return {
            ...oldSwapConfig,
            ...newSwapConfig,
        };
    }

}

// ------------------------------------------------------------------------

function swapIsValid(possibleSwapConfig, ignoredSwapIds) {
    if (possibleSwapConfig.isComplete) {
        return false;
    }

    if (ignoredSwapIds[possibleSwapConfig.id] === true) {
        return false;
    }

    switch (possibleSwapConfig.state) {
        case 'invalidated':
        case 'error':
        case 'permanenterror':
            return false;
    }

    return true;
}



export default exports;
