import React                  from 'react'
import SwapbotEmbedFooterLink from '../../connectors/SwapbotEmbedFooterLink'

const ConfirmWalletComponent = ({goBack, launchWindow, completeWalletConfirmationStep}) => {
    return <div className="swapbot-embed">
            <div className="progress-bar">
                <div className="progress" data-progress="50%" style={ {width: '50%'} }></div>
            </div>
            <div className="embed-content">
                <div className="heading">
                    Are you using a counterparty compatible bitcoin wallet?
                </div>

                <div className="buttons-container">
                    <button onClick={completeWalletConfirmationStep} type="button" className="btn-flex btn-success">Yes</button>
                    <button onClick={ () => { launchWindow("http://pockets.tokenly.com")} } type="button" className="btn-flex btn-danger">No</button>
                </div>
                <span><a href="http://pockets.tokenly.com" target="_blank">Not sure?</a></span>
            </div>
            <div className="embed-footer">
                <a onClick={() => { goBack(); }} href="#back" className="btn-back">Go Back</a>
                <SwapbotEmbedFooterLink />
            </div>
        </div>
}

export default ConfirmWalletComponent;