import swapValidator  from '../../lib/util/swapValidator'
import swapCalculator from '../../lib/util/swapCalculator'
import c              from '../../constants'

const desiredSwapReducer = (state=null, action) => {
    if (state == null || state.in == null) { state = buildDefaultDesiredSwap(); }

    if (action.type == c.SET_SWAP_AND_BOT) {
        // set the new swap config
        return {
            ...state,
            in: {
                ...state.in,
                token: action.swapConfig.in,
            },
            out: {
                ...state.out,
                token: action.swapConfig.out,
            },
            bot: action.bot,
            swapConfig: action.swapConfig,
        }
    }

    if (action.type == c.SET_QUOTES) {
        let newState = {
            ...state,
            quotes: action.quotes,
        }
        return recalculateSwapValues(newState);
    }

    if (action.type == c.UPDATE_QUOTE) {
        let newQuote = action.quote;
        if (newQuote.source == null || newQuote.pair == null) { return state; }

        let newQuotes = {...state.quotes};
        newQuotes[newQuote.source+'.'+newQuote.pair] = newQuote

        // merge in the new quote
        let newState = {
            ...state,
            quotes: newQuotes,
        }
        return recalculateSwapValues(newState);
    }

    if (action.type == c.INPUT_SET_OUT_TOKEN_QUANTITY && state.bot && state.swapConfig) {
        let { isValid, validationError } = swapValidator.validateOutAmount(action.quantity, state.bot, state.swapConfig, state.quotes)
        return recalculateSwapValues(state, action.quantity)
    }


    return state;
};

// ------------------------------------------------------------------------

let recalculateSwapValues = function(state, quantity) {
    if (state.swapConfig == null) {
        return state;
    }

    if (state.swapConfig.direction == c.DIRECTION_BUY) {
        throw new Error('Unimplemented for direction '+c.DIRECTION_BUY);
    }

    // default to sell
    return recalculateSwapValues_sell(state, quantity);
}

let recalculateSwapValues_sell = function(state, quantity=null) {
    if (quantity == null) {
        quantity = state.out.quantity;
    }
    let { isValid, validationError } = swapValidator.validateOutAmount(quantity, state.bot, state.swapConfig, state.quotes)

    return {
        ...state,
        out: {
            ...state.out,
            quantity:        quantity,
            isValid:         isValid,
            validationError: validationError,
        },
        in: {
            ...state.in,
            isValid: isValid,
            ...swapCalculator.inQuantitiesFromOutQuantity(isValid ? quantity : 0, state.swapConfig, state.quotes)
        }
    }

}

let buildDefaultDesiredSwap = function() {
    return {
        in: {
            token: '',
            quantity: 0,
        },
        out: {
            token: '',
            quantity: 0,
            isValid: false,
            validationError: null,
        },
        bot: null,
        swapConfig: null,
        quotes: {},
    }
}

export default desiredSwapReducer;

