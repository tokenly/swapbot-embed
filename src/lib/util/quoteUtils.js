import c from '../../constants';

let exports = {};

exports.resolveFiatPriceFromQuotes = function(asset, fiat, currentQuotes) {
    return resolveRate(asset, fiat, currentQuotes);
};

// ------------------------------------------------------------------------

let resolveRate = function(asset, fiat, currentQuotes) {
    var assetQuote, assetRate, btcRate, lowestAssetRateAvg;
    if (asset === 'BTC') {
        let quote = currentQuotes["bitcoinAverage.USD:BTC"];
        if (quote == null || quote.last == null) { return null; }
        return quote.last;
    }
    btcRate = resolveRate('BTC', 'USD', currentQuotes);
    if (!btcRate) {
        return null;
    }
    assetQuote = currentQuotes["poloniex.BTC:" + asset];
    if (!assetQuote) {
        return null;
    }
    assetRate = assetQuote.last;
    if (!assetRate) {
        return null;
    }
    lowestAssetRateAvg = assetQuote.lastAvg;
    if (!lowestAssetRateAvg) {
        return null;
    }
    assetRate = Math.min(assetRate, lowestAssetRateAvg);
    if (assetQuote.inSatoshis) {
        assetRate = assetRate / c.SATOSHI;
    }
    return assetRate * btcRate;
};


export default exports;