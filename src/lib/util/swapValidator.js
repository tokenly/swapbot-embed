import currency   from './currency'
import quoteUtils from './quoteUtils'

let swapValidator = {};

swapValidator.validateInAmount = function(inAmount, swapConfig) {
    let validationError = validateInAmount[swapConfig.strategy](inAmount, swapConfig);
    let isValid = (validationError != null);

    return {
        isValid,
        validationError
    }
};

swapValidator.validateOutAmount = function(quantity, bot, swapConfig, currentQuotes) {
    // don't validate an empty string
    if ((''+quantity).length == 0) {
        return {isValid: true, validationError: null}
    }

    let botBalance = balanceFromBotAndSwapConfig(bot, swapConfig);
    let validationError = validateOutAmount[swapConfig.strategy](quantity, swapConfig, botBalance, currentQuotes);
    let isValid = (validationError == null);

    if (isValid) {
        let floatValue = currency.currencyStringToFloat(quantity);
        if (floatValue <= 0) {
            isValid = false;
            validationError = 'Amount must be a number greater than 0';
        }
    }

    return {
        isValid,
        validationError
    }
};

function balanceFromBotAndSwapConfig(bot, swapConfig) {
    let asset = (swapConfig && swapConfig.out) ? swapConfig.out : '';
    return (bot.balances && bot.balances[asset]) ? parseFloat(bot.balances[asset]) : 0;
}

// ------------------------------------------------------------------------

let validateInAmount = {};

validateInAmount.shared = function(inAmount, swapConfig) {
    if (("" + inAmount).length === 0) {
        return null;
    }
    if (isNaN(inAmount)) {
        return 'The amount to send does not look like a number.';
    }
    if (inAmount < HARD_MINIMUM) {
        return 'The amount to send is too small.';
    }
    return null;
};

validateInAmount.rate = function(inAmount, swapConfig) {
    var errorMsg, formatCurrency;
    errorMsg = validateInAmount.shared(inAmount, swapConfig);
    if (errorMsg != null) {
        return errorMsg;
    }
    if ((swapConfig.min != null) && inAmount < swapConfig.min) {
        formatCurrency = currency.formatCurrency;
        return "This swap must be purchased by sending at least " + (formatCurrency(swapConfig.min)) + " " + swapConfig["in"] + ".";
    }
    return null;
};

validateInAmount.fixed = function(inAmount, swapConfig) {
    var errorMsg, inAmountSatoshis, inQtySatoshis, ratio;
    errorMsg = validateInAmount.shared(inAmount, swapConfig);
    if (errorMsg != null) {
        return errorMsg;
    }
    inAmountSatoshis = Math.round(inAmount * SATOSHI);
    inQtySatoshis = Math.round(swapConfig.in_qty * SATOSHI);
    if (inAmountSatoshis < inQtySatoshis) {
        return "You must send at least " + (currency.formatCurrency(swapConfig.in_qty)) + " " + swapConfig["in"] + " to use this swap.";
    }
    ratio = inAmountSatoshis / inQtySatoshis;
    if (ratio !== Math.floor(ratio)) {
        return "You must send a multiple of " + (currency.formatCurrency(swapConfig.in_qty)) + " " + swapConfig["in"] + ". You will receive " + (currency.formatCurrency(swapConfig.out_qty)) + " " + swapConfig.out + " for every " + (currency.formatCurrency(swapConfig.in_qty)) + " " + swapConfig["in"] + ".";
    }
    return null;
};

validateInAmount.fiat = function(inAmount, swapConfig) {
    var errorMsg;
    errorMsg = validateInAmount.shared(inAmount, swapConfig);
    if (errorMsg != null) {
        return errorMsg;
    }

    return null;
};


let validateOutAmount = {};

validateOutAmount.shared = function(outAmount, swapConfig, botBalance) {
    if (("" + outAmount).length === 0) {
        return null;
    }
    if (isNaN(outAmount)) {
        return 'The amount to purchase does not look like a number.';
    }
    if ((botBalance == null) || outAmount > botBalance) {
        return "There is not enough " + swapConfig.out + " in stock to complete this swap.";
    }
    return null;
};

validateOutAmount.rate = function(outAmount, swapConfig, botBalance) {
    var errorMsg;
    errorMsg = validateOutAmount.shared(outAmount, swapConfig, botBalance);
    if (errorMsg != null) {
        return errorMsg;
    }
    return null;
};

validateOutAmount.fixed = function(outAmount, swapConfig, botBalance) {
    var errorMsg, ratio;
    errorMsg = validateOutAmount.shared(outAmount, swapConfig, botBalance);
    if (errorMsg != null) {
        return errorMsg;
    }
    ratio = outAmount / swapConfig.out_qty;
    if (ratio !== Math.floor(ratio)) {
        return "This swap must be purchased at a rate of exactly " + (currency.formatCurrency(swapConfig.out_qty)) + " " + swapConfig.out + " for every " + (currency.formatCurrency(swapConfig.in_qty)) + " " + swapConfig["in"] + ".";
    }
    return null;
};

validateOutAmount.fiat = function(outAmount, swapConfig, botBalance, currentQuotes) {
    var errorMsg, formatCurrency;
    errorMsg = validateOutAmount.shared(outAmount, swapConfig, botBalance);
    if (errorMsg != null) {
        return errorMsg;
    }
    if ((swapConfig.min_out != null) && outAmount > 0 && outAmount < swapConfig.min_out) {
        formatCurrency = currency.formatCurrency;
        return "To use this swap, you must purchase at least " + (formatCurrency(swapConfig.min_out)) + " " + swapConfig.out + ".";
    }

    // check for existence of quote
    let fiatPrice = quoteUtils.resolveFiatPriceFromQuotes(swapConfig.in, 'USD', currentQuotes);
    if (fiatPrice == null) {
        return `Waiting on USD quote for ${swapConfig.in}`;
    }


    return null;
};



export default swapValidator;
