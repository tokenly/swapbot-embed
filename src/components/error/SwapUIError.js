import React                  from 'react'
import currency               from '../../lib/util/currency'
import SwapbotEmbedFooterLink from '../../connectors/SwapbotEmbedFooterLink'


const SwapUIError = ({error}) => {

    return <div className="swapbot-embed">
        <div className="embed-content">
            <div className="heading">
                There was an error
            </div>
            <div className="TKSB_error">
                <span className="TKSB_errorMessage">{error}</span>
            </div>


        </div>
        
    </div>


}

// ------------------------------------------------------------------------

export default SwapUIError;

/*
            <div className="embed-footer">
                <SwapbotEmbedFooterLink />
            </div>

 */