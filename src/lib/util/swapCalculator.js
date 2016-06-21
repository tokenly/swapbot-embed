import currency   from './currency'
import swapRules  from './swapRules'
import quoteUtils from './quoteUtils'
import c          from '../../constants';

let swapCalculator = {};

// returns {inQuantity, buffer, rawInQuantity, rawBuffer};
swapCalculator.inQuantitiesFromOutQuantity = function(outQuantity, swapConfig, currentQuotes) {
    return buildInQuantityFromOutQuantity[swapConfig.strategy](outQuantity, swapConfig, currentQuotes);
};


// ------------------------------------------------------------------------



let buildInQuantityFromOutQuantity = {};

buildInQuantityFromOutQuantity.rate = function(outQuantity, swapConfig) {
    var inQuantity, modifiedInQuantity, rawInQuantity;
    if ((outQuantity == null) || isNaN(outQuantity)) {
        return emptyQuantities();
    }
    if (swapConfig.direction === c.DIRECTION_SELL && (swapConfig.price != null)) {
        inQuantity = Math.ceil(c.SATOSHI * outQuantity * swapConfig.price) / c.SATOSHI;
    } else {
        inQuantity = Math.ceil(c.SATOSHI * outQuantity / swapConfig.rate) / c.SATOSHI;
    }
    rawInQuantity = inQuantity;
    modifiedInQuantity = swapRules.modifyInitialQuantityIn(outQuantity, inQuantity, swapConfig);
    if (modifiedInQuantity != null) {
        inQuantity = modifiedInQuantity;
    }
    return {quantity: inQuantity, quantityBeforeDiscount: rawInQuantity, buffer: 0, bufferBeforeDiscount: 0};
};

buildInQuantityFromOutQuantity.fixed = function(outQuantity, swapConfig) {
    var inQuantity, modifiedInQuantity, rawInQuantity;
    if ((outQuantity == null) || isNaN(outQuantity)) {
        return emptyQuantities();
    }
    inQuantity = outQuantity / (swapConfig.out_qty / swapConfig.in_qty);
    rawInQuantity = inQuantity;
    modifiedInQuantity = swapRules.modifyInitialQuantityIn(outQuantity, inQuantity, swapConfig);
    if (modifiedInQuantity != null) {
        inQuantity = modifiedInQuantity;
    }
    return {quantity: inQuantity, quantityBeforeDiscount: rawInQuantity, buffer: 0, bufferBeforeDiscount: 0};
};

buildInQuantityFromOutQuantity.fiat = function(outQuantity, swapConfig, currentQuotes) {
    var buffer, fiatRate, inQuantity, rawBuffer, rawInQuantity, ref;
    if ((outQuantity == null) || isNaN(outQuantity)) {
        return emptyQuantities();
    }
    fiatRate = buildFiatRateForToken(swapConfig["in"], 'USD', currentQuotes);
    if (fiatRate == 0 || fiatRate == null) {
        return emptyQuantities();
    }
    ref = buildInQuantityAndBufferForFiatSwap(outQuantity, swapConfig, currentQuotes);
    if (ref == null) { return emptyQuantities(); }
    inQuantity = ref[0], buffer = ref[1], rawInQuantity = ref[2], rawBuffer = ref[3];
    return {quantity: inQuantity, quantityBeforeDiscount: rawInQuantity, buffer, bufferBeforeDiscount: rawBuffer};
};

let emptyQuantities = () => {
    return {quantity: 0, quantityBeforeDiscount: 0, buffer: 0, bufferBeforeDiscount: 0};
}

// ------------------------------------------------------------------------

let buildInQuantityAndBufferForFiatSwap = function(outQuantity, swapConfig, currentQuotes) {
    var buffer, fiatRate, inQuantity, isBTC, isDivisible, marketBuffer, maxMarketBuffer, maxMarketBufferValue, modifiedInQuantity, rawBuffer, rawInQuantity, tokenCost;
    if ((outQuantity == null) || isNaN(outQuantity)) {
        return null;
    }
    fiatRate = buildFiatRateForToken(swapConfig["in"], 'USD', currentQuotes);
    if (fiatRate == 0 || fiatRate == null) {
        return null;
    }
    tokenCost = swapConfig.cost / fiatRate;
    isDivisible = swapConfig.divisible === '1' || swapConfig.divisible === true;
    isBTC = swapConfig["in"] === 'BTC';
    if (isBTC) {
        marketBuffer = 0.02;
        if (isDivisible) {
            marketBuffer = 0.005;
        }
    } else {
        marketBuffer = 0.005;
    }
    maxMarketBufferValue = tokenCost * 0.40;
    maxMarketBuffer = maxMarketBufferValue / outQuantity;
    if (marketBuffer > maxMarketBuffer) {
        marketBuffer = maxMarketBuffer;
    }
    inQuantity = outQuantity * tokenCost;
    buffer = inQuantity * marketBuffer;
    rawInQuantity = inQuantity;
    rawBuffer = buffer;
    modifiedInQuantity = swapRules.modifyInitialQuantityIn(outQuantity, inQuantity, swapConfig);
    if (modifiedInQuantity != null) {
        inQuantity = modifiedInQuantity;
        buffer = inQuantity * marketBuffer;
    }
    return [inQuantity, buffer, rawInQuantity, rawBuffer];
};

let buildFiatRateForToken = function(token, fiat, quotes) {
    return quoteUtils.resolveFiatPriceFromQuotes(token, fiat, quotes);
};

// ------------------------------------------------------------------------


export default swapCalculator;
