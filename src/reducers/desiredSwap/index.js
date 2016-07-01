import swapValidator    from '../../lib/util/swapValidator'
import swapCalculator   from '../../lib/util/swapCalculator'
import currency         from '../../lib/util/currency'
import c                from '../../constants'
import swapObjectPicker from './swapObjectPicker'

const desiredSwapReducer = (state=null, action) => {
    if (state == null || state.in == null) { state = buildDefaultDesiredSwap(); }


    if (action.type == c.SET_POSSIBLE_SWAP_OBJECTS) {
        // set the new swap objects
        return {
            ...state,
            swapObjects: action.swapObjects,
        }
    }

    if (action.type == c.CHOOSE_SWAP_OBJECT) {
        // explicitly set the swap object
        return mergeNewSwapObject(state, action.swapObject);
    }


    // ------------------------------------------------------------------------
    // user input

    if (action.type == c.INPUT_SET_OUT_TOKEN_QUANTITY) {
        return recalculateSwapValues(state, null, action.quantity)
    }

    if (action.type == c.INPUT_SET_OUT_TOKEN) {
        let newState = adjustStateForNewOutToken(state, action.token);
        return recalculateSwapValues(newState, action.token, null)
    }

    if (action.type == c.INPUT_SET_IN_TOKEN) {
        let newState = adjustStateForNewInToken(state, action.token);
        return recalculateSwapValues(newState, null, null, action.token)
    }

    if (action.type == c.INPUT_SET_IN_TOKEN_QUANTITY) {
        return recalculateSwapValues(state, null, null, null, action.quantity)
    }



    // ------------------------------------------------------------------------
    // quotes

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


    return state;
};

// ------------------------------------------------------------------------

let mergeNewSwapObject = function(state, swapObject) {
    return {
        ...state,
        in: {
            ...state.in,
            token: swapObject.swap.in,
        },
        out: {
            ...state.out,
            token: swapObject.swap.out,
        },
        bot: swapObject.bot,
        swapConfig: swapObject.swap,
    }

}

let recalculateSwapValues = function(state, outToken=null, outQuantity=null, inToken=null, inQuantity=null) {
    // determine direction
    let RECALC_IN=0, RECALC_OUT=1;
    let recalcDirection = RECALC_IN;
    if (inToken != null || inQuantity != null) { recalcDirection = RECALC_OUT; }
    // console.log('recalcDirection: '+(recalcDirection == RECALC_IN ? 'RECALC_IN' : 'RECALC_OUT'));

    // set defaults
    if (outToken == null) { outToken = state.out.token; }
    if (outQuantity == null) { outQuantity = state.out.quantity; }
    if (inToken == null) { inToken = state.in.token; }
    if (inQuantity == null) { inQuantity = state.in.quantity; }

    // we need to pick the best swap based on the new data
    let newState = {};
    let swapObject = swapObjectPicker.pickBestSwapObject(state.swapObjects, outToken, outQuantity, inToken);
    // console.log('swapObject: ',!!swapObject);

    if (swapObject != null) {
        newState = {
            ...state,
            in: {
                ...state.in,
                token:    swapObject.swap.in,
                quantity: inQuantity,
            },
            out: {
                ...state.out,
                token:    swapObject.swap.out,
                quantity: outQuantity,
            },
            bot: swapObject.bot,
            swapConfig: swapObject.swap,

        }

        let outQuantityToValidate = outQuantity;
        if (recalcDirection == RECALC_IN) {
            let inQuantities = swapCalculator.inQuantitiesFromOutQuantity(outQuantity, swapObject.swap, state.quotes)
            newState.in = {
                ...newState.in,
                ...inQuantities,
                quantity:               currency.formatInput(inQuantities.quantity),
                quantityBeforeDiscount: currency.formatInput(inQuantities.quantityBeforeDiscount),
            }
        } else if (recalcDirection == RECALC_OUT) {
            // calculate the new out quantity
            outQuantityToValidate = swapCalculator.outQuantityFromInQuantity(inQuantity, swapObject.swap, state.quotes);
            newState.out = {
                ...newState.out,
                quantity: currency.formatInput(outQuantityToValidate)
            }
        }

        // validate the new swapObject
        let { isValid, validationError } = swapValidator.validateOutAmount(outQuantityToValidate, swapObject.bot, swapObject.swap, state.quotes);
        // console.log('validateOutAmount outQuantityToValidate='+outQuantityToValidate+' isValid:',isValid,' validationError:', validationError);
        newState = {
            ...newState,
            isValid:         isValid,
            validationError: validationError
        }

    } else {
        // generic new state with no valid swap object
        newState = {
            ...state,
            in: {
                ...state.in,
                quantity: inQuantity,
                token:    inToken,
            },
            out: {
                ...state.out,
                quantity: outQuantity,
                token:    outToken,
            },

            isValid:         true,
            validationError: null
        }

    }

    return newState;
}

function adjustStateForNewOutToken(state, newOutToken) {
    if (state.swapObjects == null) {
        return state;
    }

    let oldInToken = state.in.token;
    let newInToken = null;
    for (var swapObject of state.swapObjects) {
        if (swapObject.swap.out == newOutToken) {
            // if exact match, then choose it
            if (newInToken == oldInToken) {
                newInToken = oldInToken;
                break;
            }

            if (newInToken == null) {
                newInToken = swapObject.swap.in;
            }
        }
    }

    return {
            ...state,
            in: {
                ...state.in,
                token: newInToken,
            },
        }
}

function adjustStateForNewInToken(state, newInToken) {
    if (state.swapObjects == null) {
        return state;
    }

    let oldOutToken = state.out.token;
    let newOutToken = null;
    for (var swapObject of state.swapObjects) {
        if (swapObject.swap.out == newOutToken) {
            // if exact match, then choose it
            if (newOutToken == oldOutToken) {
                newOutToken = oldOutToken;
                break;
            }

            if (newOutToken == null) {
                newOutToken = swapObject.swap.out;
            }
        }
    }

    return {
            ...state,
            out: {
                ...state.in,
                token: newOutToken,
            },
        }
}

function adjustStateForNewInQuantity(state, newInQuantity) {
    if (state.swapObjects == null) {
        return state;
    }

    let newOutQuantity = swapCalculator.outQuantityFromInQuantity(newInQuantity, state.swapConfig)
    console.log('newInQuantity = ',newInQuantity, 'newOutQuantity = ',newOutQuantity);

    return {
            ...state,
            in: {
                ...state.in,
                quantity: newInQuantity,
            },
            out: {
                ...state.out,
                quantity: newOutQuantity,
            },
        }
}

let buildDefaultDesiredSwap = function() {
    return {
        in: {
            token: '',
            quantity: '',
        },
        out: {
            token: '',
            quantity: '',
        },
        swapObjects: null,
        bot: null,
        swapConfig: null,
        quotes: {},
    }
}

export default desiredSwapReducer;

