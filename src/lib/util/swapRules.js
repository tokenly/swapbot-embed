var BotConstants, exports, findBestDiscount, formatters, getAllSwapRulesFromConfigs, popover, sortDiscounts;

// formatters = require('./formatters');

import c from '../../constants';


exports = {};

exports.modifyInitialQuantityIn = function(outAmount, inAmount, swapConfig) {
    var bestDiscount;
    bestDiscount = findBestDiscount(swapConfig.swapRules, outAmount);
    if (bestDiscount != null) {
        return inAmount * (1 - bestDiscount.pct);
    }
    return null;
};

// ------------------------------------------------------------------------

findBestDiscount = function(allSwapRules, orderQuantity) {
    var bestDiscount, bestPct;
    if (orderQuantity == null) {
        orderQuantity = null;
    }
    if (allSwapRules == null) {
        return null;
    }
    bestPct = null;
    bestDiscount = null;
    allSwapRules.map(function(swapRule) {
        if (swapRule.ruleType === c.RULE_TYPE_BULK_DISCOUNT) {
            swapRule.discounts.map(function(discount) {
                let moq = parseFloat(discount.moq);
                let pct = parseFloat(discount.pct);
                if ((orderQuantity != null) && moq > orderQuantity) {
                    return;
                }
                if (bestPct === null || pct > bestPct) {
                    bestPct = pct;
                    bestDiscount = discount;
                }
            });
        }
    });
    return bestDiscount;
};


export default exports;
