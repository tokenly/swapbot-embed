import { connect }            from 'react-redux';
import actions                from '../actions';
import EnterNotificationEmail from '../components/includes/EnterNotificationEmail'
import swapbotApi             from '../lib/swapbotApi';


const DEBUG = (document.location.href.indexOf('_SBDEBUG') >= 0);

// connect the component
let mapStateToProps = (state) => {
    return {
        uiState: state.uiState,
        swap: state.matchedSwap.matchedSwap,
    }
};
let mapDispatchToProps = (dispatch) => {
    return {
        setEmail: (newEmail) => {
            dispatch(actions.setNotificationEmail(newEmail));
        },

        sendEmail: (email, swapId) => {
            let level = 0;
            dispatch(actions.submitNotificationEmail(email, swapId, level));

            if (DEBUG) {
                debugSubmitCustomerEmail(dispatch, swapId, email, level);
                return;
            }

            swapbotApi.submitCustomerEmail(swapId, email, level).then(
                (response) => {
                    let success = true;
                    let errorMsg = null;
                    dispatch(actions.completeNotificationSubmission(success, errorMsg));
                }, (error) => {
                    let success = false;
                    let errorMsg = ''+error;
                    dispatch(actions.completeNotificationSubmission(success, errorMsg));
                }
            );

        },

    };
};

let ConnectedEnterNotificationEmail = connect(mapStateToProps, mapDispatchToProps)(EnterNotificationEmail);

// ------------------------------------------------------------------------

function debugSubmitCustomerEmail(dispatch, swapId, email, level) {
    let isErrorEmail = (email.indexOf('error') >= 0);
    let success, errorMsg;

    if (isErrorEmail) {
        success = false;
        errorMsg = "There was a (test) error with this email";
    } else {
        success = true;
        errorMsg = null;
    }

    setTimeout(() => {
        console.log('[DEBUG] sending completeNotificationSubmission success:', success);
        dispatch(actions.completeNotificationSubmission(success, errorMsg));
    }, 1000);

}

// ------------------------------------------------------------------------


export default ConnectedEnterNotificationEmail;
