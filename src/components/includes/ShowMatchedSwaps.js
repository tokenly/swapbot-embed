import React                   from 'react'
import { connect }             from 'react-redux';
import pluralize               from 'pluralize'
import actions                 from '../../actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const ShowMatchedSwaps = ({matchData, bot, chooseMySwap, ignoreSwap}) => {

    let confirmationsRequired = bot ? bot.confirmationsRequired : 0;
    // console.log('matchData.anyMatchedSwapsExist=',matchData.anyMatchedSwapsExist,' confirmationsRequired=',confirmationsRequired,' bot=',bot);

    return <div className="matched-swaps-list">
            { (matchData.anyMatchedSwapsExist) ?
                <div>
                    <div className="matched-swap-header">We've detected one or multiple orders that might be yours, please select the correct one to continue.</div>
                    <ReactCSSTransitionGroup transitionName="swaplistitem" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    { matchData.possibleMatchedSwapsArray.slice(0,1).map((swap)=>{
                        return <div key={'swap-'+swap.id} className="matched-swap">
                            <div className="time">{swap.fromNow}</div>
                            <div className="title">Transaction Received</div>
                            <div className="msg">{swap.message}</div>
                            <div className="confirmations">This transaction has <b>{ pluralize('confirmation', (swap.confirmations == null ? 0 : swap.confirmations), true) }</b>.</div>
                            <button onClick={()=>{chooseMySwap(swap)}} type="button" className="btn-flex btn-success">Choose</button>
                            <button onClick={()=>{ignoreSwap(swap)}} type="button" className="btn-flex btn-danger">Not My Transaction</button>
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
                    <div className="unmatched-swap-header">Waiting for payment...</div>
                </div>
            : null }
        </div>
}

// connect the component
let mapStateToProps = (state) => {
    return {
        bot: state.desiredSwap.bot,
        matchData: state.matchedSwap,
    }
};
let mapDispatchToProps = (dispatch) => {
    return {
        chooseMySwap: (swap) => {
            dispatch(actions.chooseMySwap(swap));
            dispatch(actions.completeSendPaymentStep());
        },
        ignoreSwap: (swap) => {
            dispatch(actions.ignoreSwap(swap));
        },
    };
};

let ConnectedShowMatchedSwaps = connect(mapStateToProps, mapDispatchToProps)(ShowMatchedSwaps);

// ------------------------------------------------------------------------


export default ConnectedShowMatchedSwaps;
