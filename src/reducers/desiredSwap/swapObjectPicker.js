
let exports = {};

exports.pickBestSwapObject = (swapObjects, outToken, outQuantity, inToken)=>{
    if (swapObjects == null) { return null; }

    // filter by in and out token
    let matchedSwapObjects = filterByOutAndInToken(swapObjects, outToken, inToken);

    matchedSwapObjects = filterByOutQuantity(matchedSwapObjects, outToken, outQuantity, matchedSwapObjects);
    
    matchedSwapObjects = sortByBestPrice(matchedSwapObjects, matchedSwapObjects);

    return matchedSwapObjects[0];
};


function filterByOutAndInToken(swapObjects, outToken, inToken) {
    return swapObjects.filter((swapObject) => {
        if (outToken != null && outToken.length > 0 && swapObject.swap.out != outToken) { return false; }
        if (inToken != null && inToken.length > 0 && swapObject.swap.in != inToken) { return false; }
        return true;
    });
}

function filterByOutQuantity(swapObjects, outToken, outQuantity, defaultValue=null) {
    if (outToken == null || outQuantity == null || outToken.length == 0) { return swapObjects; }

    let filtered = swapObjects.filter((swapObject) => {
        let balance = swapObject.bot.balances[outToken];
        return (balance >= outQuantity);
    });

    if (filtered.length == 0) {
        return defaultValue;
    }

    return filtered;
}

function sortByBestPrice(swapObjects, defaultValue) {
    swapObjects.sort(function(sObjectA, sObjectB) {
        return buildSwapCost(sObjectA) - buildSwapCost(sObjectB);
    })
    return defaultValue;
}

function buildSwapCost(swapObject) {
    let swap = swapObject.swap;
    switch (swap.strategy) {
        case 'rate':
            return swap.rate > 0 ? 1 / swap.rate : 0;
        case 'fixed':
            return swap.out_qty > 0 ? swap.in_qty / swap.out_qty : 0;
        case 'fiat':
            return swap.cost;
    }
    return 0;
}

export default exports;
