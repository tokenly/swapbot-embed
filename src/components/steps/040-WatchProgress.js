import React                  from 'react'
import currency               from '../../lib/util/currency'
import SwapbotEmbedFooterLink from '../../connectors/SwapbotEmbedFooterLink'
import EnterNotificationEmail from '../../connectors/EnterNotificationEmail'
import pluralize              from 'pluralize'

const WatchProgressComponent = ({desiredSwap, bot, swap, goBack}) => {
    return <div className="swapbot-embed">
        <div className="progress-bar">
            <div className="progress" data-progress="100%" style={ {width: '100%'} }></div>
        </div>
        <div className="embed-content">
            <div className="heading">
                Summary
            </div>
            <p className="review-text">
                <span> You are purchasing </span>
                <span className="token-text">
                    {currency.formatCurrency(desiredSwap.out.quantity, desiredSwap.out.token)}
                </span> 
                <br/>
                <span> and paying with </span>
                <span className="token-text">
                    {currency.formatCurrency(desiredSwap.in.quantity, desiredSwap.in.token)}
                </span>
            </p>

            <div className="matched-swap matched-swap-watch">
                <div className="matched-swap--heading">
                    <div className="time">{swap.fromNow}</div>
                    <div className="title">{swap.isComplete ? 'Swap Complete' : 'Swap in Progress'}</div>
                </div>
                <div className="msg">{swap.message}</div>
                <div className="confirmations">This swap has { pluralize('confirmation', swap.confirmations == null ? 0 : swap.confirmations, true) } in and { pluralize('confirmation', swap.confirmationsOut == null ? 0 : swap.confirmationsOut, true) } out.</div>
            </div>
        </div>

        <EnterNotificationEmail/>

        <div className="embed-footer">
            <a onClick={() => { goBack(); }} className="btn-back">Go Back</a>
            <SwapbotEmbedFooterLink />
        </div>


    </div>
}

// ------------------------------------------------------------------------

export default WatchProgressComponent;