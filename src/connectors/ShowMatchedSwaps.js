import { connect }      from 'react-redux';
import actions          from '../actions';
import ShowMatchedSwaps from '../components/includes/ShowMatchedSwaps'

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
