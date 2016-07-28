import c from '../constants'

let actions = {};

// actions.setChosenSwapConfigAndBot = (swapConfig, bot) => {
//     return {
//         type: c.CHOOSE_SWAP_OBJECT,
//         swapConfig: swapConfig,
//         bot: bot,
//     }
// }

actions.setSwapObjects = (swapObjects) => {
    return {
        type: c.SET_POSSIBLE_SWAP_OBJECTS,
        swapObjects: swapObjects
    }
}

actions.setCurrentQuotes = (quotes) => {
    return {
        type:   c.SET_QUOTES,
        quotes: quotes,
    }
}
actions.updateQuote = (newQuote) => {
    return {
        type:  c.UPDATE_QUOTE,
        quote: newQuote,
    }
}

actions.setOutToken = (token) => {
    return {
        type:  c.INPUT_SET_OUT_TOKEN,
        token: token,
    }
}
actions.setOutTokenQuantity = (quantity) => {
    return {
        type: c.INPUT_SET_OUT_TOKEN_QUANTITY,
        quantity: quantity,
    }
}

actions.setInToken = (token) => {
    return {
        type:  c.INPUT_SET_IN_TOKEN,
        token: token,
    }
}
actions.setInTokenQuantity = (quantity) => {
    return {
        type: c.INPUT_SET_IN_TOKEN_QUANTITY,
        quantity: quantity,
    }
}


actions.completeEnterAmountStep = () => {
    return {
        type: c.UI_COMPLETE_ENTER_AMOUNT
    }
}

actions.completeWalletConfirmationStep = () => {
    return {
        type: c.UI_COMPLETE_WALLET_COMFIRMATION_STEP
    }
}

actions.completeSendPaymentStep = () => {
    return {
        type: c.UI_COMPLETE_SEND_PAYMENT_STEP
    }
}

actions.goToStep = (step) => {
    return {
        type: c.UI_GO_TO_STEP,
        step
    }
}

actions.showQRModal = () => {
    return {
        type: c.UI_SHOW_QR_MODAL
    }
}
actions.hideQRModal = () => {
    return {
        type: c.UI_HIDE_QR_MODAL
    }
}

// ------------------------------------------------------------------------
// swapstream

actions.setDesiredSwapstreamSwap = (desiredSwap) => {
    return {
        type: c.SWAPSTREAM_SET_DESIRED_SWAP,
        desiredSwap,
    }
}
actions.clearDesiredSwapstreamSwap = () => {
    return {
        type: c.SWAPSTREAM_CLEAR_DESIRED_SWAP
    }
}

actions.handleSwapstreamEvent = (event) => {
    return {
        type: c.SWAPSTREAM_EVENT,
        event
    }
}

actions.swapstreamTimeHeartbeat = () => {
    return {
        type: c.SWAPSTREAM_TIME_HEARTBEAT,
    }
}

actions.chooseMySwap = (swap) => {
    return {
        type: c.CHOOSE_MY_SWAP,
        swap
    }
}

export default actions;
