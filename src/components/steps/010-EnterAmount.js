import React                  from 'react'
import currency               from '../../lib/util/currency'
import SwapbotEmbedFooterLink from '../includes/SwapbotEmbedFooterLink'


const EnterAmountComponent = ({swapObjects, desiredSwap, setOutToken, setOutTokenQuantity, setInToken, setInTokenQuantity, completeEnterAmountStep}) => {
    // console.log('EnterAmountComponent desiredSwap.out.token=', desiredSwap.out.token);

    let completeIfValid = function() {
        if (desiredSwap.isValid) {
            completeEnterAmountStep();
        }
    }

    // let availableForPurchase = (bot.balances ? currency.formatCurrency(bot.balances[desiredSwap.out.token]) : 0);

    let isComplete = (desiredSwap.isValid && desiredSwap.out.quantity != null && desiredSwap.out.quantity != '' && desiredSwap.out.quantity > 0);
    let showError = (!desiredSwap.isValid && desiredSwap.out.quantity != null && desiredSwap.out.quantity != '');

    return <div className="swapbot-embed">
        <div className="progress-bar">
            <div className="progress" data-progress="25%" style={ {width: '25%'} }></div>
        </div>
        <div className="embed-content">
            <div className="heading">
                I would like to ...
            </div>

            {showError ? (

                <div className="TKSB_error">
                    <span className="TKSB_errorMessage">{desiredSwap.validationError}</span>
                </div>

            ) : null}

            <div className="tokens-container">
                <div className="token">
                    <div className="token-heading">Purchase</div>
                    
                    <select name="tokenout" value={desiredSwap.out.token} onChange={ (e) => { setOutToken(e.target.value) } }>
                        { renderUniqueOutTokenOptionsFromSwapObjects(swapObjects) }
                    </select>

                    <input type="text" name="quantity" value={ desiredSwap.out.quantity } onChange={ (e) => setOutTokenQuantity(e.target.value) } placeholder="Enter Amount" />
                </div>
                <div className="token-divider">
                    {' and '}
                    <i className="arrow-right icon-right"></i>
                    <i className="arrow-down icon-down"></i>
                </div>
                <div className="token">
                    <div className="token-heading">Pay With</div>
                    
                    <select name="tokenin" value={desiredSwap.in.token} onChange={ (e) => { setInToken(e.target.value) } }>
                        { renderUniqueInTokenOptionsFromSwapObjectsForOutToken(swapObjects, desiredSwap.out.token) }
                    </select>

                    <input type="text" name="quantity" value={ desiredSwap.in.quantity } onChange={ (e) => setInTokenQuantity(e.target.value) } placeholder="Waiting for Amount" />
                </div>
            </div>

            <button className={ isComplete ? 'btn-success' : 'btn-disabled' } onClick={completeIfValid}>Begin Swap</button>
        </div>
            <div className="embed-footer">
                <SwapbotEmbedFooterLink />
            </div>
        
    </div>


}

// ------------------------------------------------------------------------

function renderUniqueOutTokenOptionsFromSwapObjects(swapObjects) {
    if (swapObjects == null || swapObjects.length < 1) { return noneAvailable(); }
    // console.log('swapObjects', swapObjects);

    // render out tokens
    let anyFound = false;
    let usedTokensMap = {};
    let newOptions = swapObjects.map((swapObject) => {
        let token = swapObject.swap.out;
        if (token != null && usedTokensMap[token] == null) {
            usedTokensMap[token] = true;
            anyFound = true;
            return <option key={token} value={token}>{token}</option>
        }
    })

    if (!anyFound ) { return noneAvailable(); }
    return newOptions;
}

function renderUniqueInTokenOptionsFromSwapObjectsForOutToken(swapObjects, chosenOutToken) {
    if (swapObjects == null || swapObjects.length < 1 || chosenOutToken == null || chosenOutToken.length < 1) { return noneAvailable(); }

    // render out tokens
    let anyFound = false;
    let usedTokensMap = {};
    let newOptions = swapObjects.map((swapObject) => {
        if (swapObject.swap.out == chosenOutToken) {
            let token = swapObject.swap.in;
            if (token != null && usedTokensMap[token] == null) {
                usedTokensMap[token] = true;
                anyFound = true;
                return <option key={token} value={token}>{token}</option>
            }
        }
    })

    if (!anyFound ) { return noneAvailable(); }
    return newOptions;
}

function noneAvailable() {
    return <option value="">- None Available -</option>;
}


export default EnterAmountComponent;

/*

        <h1>Step 1: Enter Amount</h1>

        {!desiredSwap.isValid && desiredSwap.out.quantity != null && desiredSwap.out.quantity.length > 0 ? (

            <div className="TKSB_error">
                <span className="TKSB_errorMessage">{desiredSwap.out.validationError}</span>
            </div>

        ) : null}

        <p>{desiredSwap.out.token} available for purchase: {availableForPurchase}</p>

        <p>I would like to purchase <input defaultValue={desiredSwap.out.quantity} onChange={(event) => { setOutTokenQuantity(event.target.value, bot, swapConfig) }} type="out.quantity"/> {desiredSwap.out.token}</p>

        {desiredSwap.isValid ? (

            <p>Cost: {currency.formatCurrency(desiredSwap.in.quantity, desiredSwap.in.token)}</p>

        ) : null}

        <button type="button" className="btn btn-default" onClick={completeIfValid}>Next</button>



 */