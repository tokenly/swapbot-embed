import React                   from 'react'
import pluralize               from 'pluralize'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const ShowMatchedSwaps = ({matchData, bot, chooseMySwap, ignoreSwap}) => {

    let confirmationsRequired = bot ? bot.confirmationsRequired : 0;
    // console.log('matchData.anyMatchedSwapsExist=',matchData.anyMatchedSwapsExist,' confirmationsRequired=',confirmationsRequired,' bot=',bot);

    return <div className="matched-swaps-list">
            { (matchData.anyMatchedSwapsExist) ?
                <div>
                    <ReactCSSTransitionGroup transitionName="swaplistitem" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    { matchData.possibleMatchedSwapsArray.slice(0,1).map((swap)=>{
                        return <div key={'swap-'+swap.id} className="matched-swap">
                            <div className="matched-swap--heading">
                                <div className="time">{swap.fromNow}</div>
                                <div className="title">Payment Detected</div>
                            </div>

                            <div className="msg">{swap.message}</div>
                            <div className="confirmations">This transaction has <b>{ pluralize('confirmation', (swap.confirmations == null ? 0 : swap.confirmations), true) }</b>.</div>
                            <div className="buttons-container">
                                <button onClick={()=>{chooseMySwap(swap)}} type="button" className="btn-flex btn-success">That's My Payment</button>
                                <button onClick={()=>{ignoreSwap(swap)}} type="button" className="btn-flex btn-danger">Not Mine</button>
                            </div>
                        </div>
                    })}
                    </ReactCSSTransitionGroup>
                    { matchData.possibleMatchedSwapsArray.length > 1 ?
                        <div className="more-swaps">Plus { pluralize('additional swap', matchData.possibleMatchedSwapsArray.length - 1, true ) }</div>
                    : null }
                </div>
            : null }
            { (!matchData.anyMatchedSwapsExist) ?
                <div>
                    <div className="unmatched-swap-header">
                        <div className="cssload-thecube">
                            <div className="cssload-cube cssload-c1"></div>
                            <div className="cssload-cube cssload-c2"></div>
                            <div className="cssload-cube cssload-c4"></div>
                            <div className="cssload-cube cssload-c3"></div>
                        </div>
                        <div className="unmatched-swap-text">Waiting for payment...</div>
                    </div>
                </div>
            : null }
        </div>
}


// ------------------------------------------------------------------------

export default ShowMatchedSwaps;
