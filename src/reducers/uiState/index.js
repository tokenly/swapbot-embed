import c from '../../constants'

const uiStateReducer = (state={step: 'EnterAmount'}, action) => {
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

    return state;
};

export default uiStateReducer;

