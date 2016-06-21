import React from 'react'
import currency from '../../lib/util/currency'

const SendPaymentComponent = ({desiredSwap, swapConfig, bot, goBack}) => {
    return <div className="TKSB_send-payment">
        <h1>Step 3: Send Payment</h1>
        <p>Send {currency.formatCurrency(desiredSwap.in.quantity, desiredSwap.in.token)} to {bot.address}</p>
        <p>This bot will send you {currency.formatCurrency(desiredSwap.out.quantity, desiredSwap.out.token)} in return.</p>
        <div className="nav">
            <a onClick={() => { goBack(); }} href="#back">Back</a>
        </div>
    </div>
}

export default SendPaymentComponent;