import numeral from '../../../node_modules/numeral'
import c from '../../constants';

let exports, isZero, strRepeat;

exports = {};


isZero = function(value) {
    if ((value == null) || value.length === 0 || value === 0) {
        return true;
    }
    return false;
};

exports.isZero = isZero;

exports.isNotZero = function(value) {
    return !isZero(value);
};

exports.currencyStringToFloat = (value) => {
  return numeral(value).value();
}

exports.formatInput = function(value) {
    if (value == null || value.length == 0) { return value; }
    let formatted = exports.formatCurrency(value, null, '0.[00000000]', false)
    if (formatted.length == 0) { return value; }
    return formatted
}

exports.formatCurrencyAsNumber = function(value) {
    if ((value == null) || isNaN(value)) {
        return '0';
    }
    return numeral(value).format('0.[00000000]');
};


exports.formatIfValid = function(value, currencyPostfix) {
    if (value == null || value.length == 0) { return value; }
    let formatted = exports.formatCurrency(value, currencyPostfix)
    if (formatted.length == 0) { return value; }
    return formatted
}

exports.approximateCurrency = function(value, currencyPostfix) {
    return exports.formatCurrency(value, currencyPostfix);
}

exports.formatCurrency = function(value, currencyPostfix, formatString=null, useSatoshisForSmallValues=true) {
    var decimalText, satoshisPrefix, valueText;
    if (currencyPostfix == null) {
        currencyPostfix = '';
    }
    if ((value == null) || isNaN(value)) {
        return '';
    }
    if (formatString == null) { formatString = '0,0.[00000000]'; }
    decimalText = numeral(value).format(formatString);
    if (useSatoshisForSmallValues && value > 0 && value < 0.0001) {
        satoshisPrefix = numeral(value * c.SATOSHI).format('0') + ' satoshis';
        valueText = satoshisPrefix + " (" + decimalText + ")";
    } else {
        valueText = decimalText;
    }
    return valueText + ((currencyPostfix != null ? currencyPostfix.length : void 0) ? ' ' + currencyPostfix : '');
};


// exports.formatConfirmations = function(confirmations) {
//     if (confirmations == null) {
//         return 0;
//     }
//     return numeral(confirmations).format('0');
// };

// exports.confirmationsProse = function(confirmations) {
//     return (exports.formatConfirmations(confirmations)) + " " + (exports.confirmationsWord(confirmations));
// };

// exports.confirmationsWord = function(confirmations) {
//     return "confirmation" + (confirmations === 1 ? '' : 's');
// };

// exports.satoshisToValue = function(amount, currencyPostfix) {
//     if (currencyPostfix == null) {
//         currencyPostfix = 'BTC';
//     }
//     return exports.formatCurrency(amount / c.SATOSHI, currencyPostfix);
// };


// exports.formatCurrencyWithForcedZero = function(value, currencyPostfix) {
//     if (currencyPostfix == null) {
//         currencyPostfix = '';
//     }
//     return exports.formatCurrency((isZero(value) ? 0 : value), currencyPostfix);
// };

// exports.formatPercentage = function(value, places) {
//     var decimalText, trailingZeros;
//     if (places == null) {
//         places = 8;
//     }
//     if ((value == null) || isNaN(value)) {
//         return '';
//     }
//     if (places > 0) {
//         trailingZeros = strRepeat('0', places);
//         decimalText = numeral(value).format('0.[' + trailingZeros + ']');
//     } else {
//         decimalText = numeral(value).format('0');
//     }
//     return decimalText;
// };



// exports.formatFiatCurrency = function(value, currencyPrefix) {
//     var formattedCurrencyString, prefix;
//     if (currencyPrefix == null) {
//         currencyPrefix = '$';
//     }
//     if ((value == null) || isNaN(value)) {
//         return '';
//     }
//     formattedCurrencyString = numeral(value).format('0,0.00');
//     prefix = '';
//     if (formattedCurrencyString === '0.00') {
//         prefix = 'less than ';
//         formattedCurrencyString = '0.01';
//     }
//     return prefix + ((currencyPrefix != null ? currencyPrefix.length : void 0) ? currencyPrefix : '') + formattedCurrencyString;
// };

// exports.formatArbitraryPrecisionFiatCurrency = function(value, currencyPrefix, formatString) {
//     var formattedCurrencyString, prefix;
//     if (currencyPrefix == null) {
//         currencyPrefix = '$';
//     }
//     if (formatString == null) {
//         formatString = '0,0.00[000000]';
//     }
//     if ((value == null) || isNaN(value)) {
//         return '';
//     }
//     formattedCurrencyString = numeral(value).format(formatString);
//     prefix = '';
//     return prefix + ((currencyPrefix != null ? currencyPrefix.length : void 0) ? currencyPrefix : '') + formattedCurrencyString;
// };

// ------------------------------------------------------------------------

strRepeat = function(string, times) {
    var result;
    result = '';
    while (times > 0) {
        if (times & 1) {
            result += string;
        }
        times >>= 1;
        string += string;
    }
    return result;
};

export default exports;
