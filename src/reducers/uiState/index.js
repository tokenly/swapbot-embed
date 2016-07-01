import c from '../../constants'

const uiStateReducer = (state=null, action) => {
    if (state == null) {
        state = defaultState();
    }
    if (action.type == c.UI_GO_TO_STEP) {
        return {
            ...state,
            step: action.step,
        }
    }

    if (action.type == c.UI_COMPLETE_ENTER_AMOUNT) {
        return {
            ...state,
            step: 'ConfirmWallet',
        }
    }

    if (action.type == c.UI_COMPLETE_WALLET_COMFIRMATION_STEP) {
        return {
            ...state,
            step: 'SendPayment',
        }
    }

    if (action.type == c.UI_COMPLETE_WALLET_COMFIRMATION_STEP) {
        return {
            ...state,
            step: 'SendPayment',
        }
    }

    if (action.type == c.UI_SHOW_QR_MODAL) {
        return {
            ...state,
            QRModalActive: true,
        }
    }

    if (action.type == c.UI_HIDE_QR_MODAL) {
        return {
            ...state,
            QRModalActive: false,
        }
    }

    return state;
};

// ------------------------------------------------------------------------

function defaultState() {
    return {
        step:          'EnterAmount',
        QRModalActive: false,
    }
}

export default uiStateReducer;

