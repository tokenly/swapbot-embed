import React from 'react'
import currency from '../../lib/util/currency'

const EnterAmountComponent = ({uiState, swapConfig, bot, desiredSwap, setOutTokenAmount, completeEnterAmountStep}) => {

    let completeIfValid = function() {
        if (desiredSwap.out.isValid) {
            completeEnterAmountStep();
        }
    }

    let availableForPurchase = (bot.balances ? currency.formatCurrency(bot.balances[desiredSwap.out.token]) : 0);

    return <div className="TKSB_enter-amount">

        <h1>Step 1: Enter Amount</h1>

        {!desiredSwap.out.isValid && desiredSwap.out.quantity != null && desiredSwap.out.quantity.length > 0 ? (

            <div className="TKSB_error">
                <span className="TKSB_errorMessage">{desiredSwap.out.validationError}</span>
            </div>

        ) : null}

        <p>{desiredSwap.out.token} available for purchase: {availableForPurchase}</p>

        <p>I would like to purchase <input defaultValue={desiredSwap.out.quantity} onChange={(event) => { setOutTokenAmount(event.target.value, bot, swapConfig) }} type="out.quantity"/> {desiredSwap.out.token}</p>

        {desiredSwap.in.isValid ? (

            <p>Cost: {currency.formatCurrency(desiredSwap.in.quantity, desiredSwap.in.token)}</p>

        ) : null}

        <button type="button" className="btn btn-default" onClick={completeIfValid}>Next</button>

    </div>
}

export default EnterAmountComponent;