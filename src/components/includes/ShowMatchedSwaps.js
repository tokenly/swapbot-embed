import React       from 'react'
import { connect } from 'react-redux';
import pluralize   from 'pluralize'
import actions     from '../../actions';

const ShowMatchedSwaps = ({matchData, bot, chooseMySwap}) => {

    let confirmationsRequired = bot ? bot.confirmationsRequired : 0;
    // console.log('matchData.anyMatchedSwapsExist=',matchData.anyMatchedSwapsExist,' confirmationsRequired=',confirmationsRequired,' bot=',bot);

    return <div className="matched-swaps-list">
            { (matchData.anyMatchedSwapsExist) ?
                <div>
                    <div className="matched-swap-header">We've detected one or multiple orders that might be yours, please select the correct one to continue.</div>
                    { matchData.possibleMatchedSwapsArray.map((swap)=>{
                        console.log('possibleMatchedSwapsArray swap.message', swap.message);
                        console.log('possibleMatchedSwapsArray swap.isComplete', swap.isComplete);
                        return <div key={'swap-'+swap.id} className="matched-swap">
                            <div className="time">{swap.fromNow}</div>
                            <div className="title">Transaction Received</div>
                            <div className="msg">{swap.message}</div>
                            <div className="confirmations">This transaction has <b>{ pluralize('confirmation', (swap.confirmations == null ? 0 : swap.confirmations), true) }</b>.</div>
                            <button onClick={()=>{chooseMySwap(swap)}} type="button" className="btn-flex btn-success">Choose</button>
                        </div>
                    })}
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
        }
    };
};

let ConnectedShowMatchedSwaps = connect(mapStateToProps, mapDispatchToProps)(ShowMatchedSwaps);

// ------------------------------------------------------------------------


export default ConnectedShowMatchedSwaps;
