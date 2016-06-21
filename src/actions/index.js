import c from '../constants'

let actions = {};

actions.setChosenSwapConfigAndBot = (swapConfig, bot) => {
    return {
        type: c.SET_SWAP_AND_BOT,
        swapConfig: swapConfig,
        bot: bot,
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

actions.setOutTokenAmount = (quantity, bot, swapConfig) => {
    return {
        type: c.INPUT_SET_OUT_TOKEN_QUANTITY,
        quantity: quantity,
        bot: bot,
        swapConfig: swapConfig
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

actions.goToStep = (step) => {
    return {
        type: c.UI_GO_TO_STEP,
        step
    }
}

export default actions;
