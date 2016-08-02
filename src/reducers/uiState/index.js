import c          from '../../constants'
import actions    from '../../actions'
import isEmail    from 'validator/lib/isEmail';

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

    if (action.type == c.UI_COMPLETE_SEND_PAYMENT_STEP) {
        return {
            ...state,
            step: 'WatchProgress',

            ...defaultEmailSubmissionState(),
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


    if (action.type == c.UI_SET_NOTIFICATION_EMAIL) {
        return {
            ...state,
            email:        action.email,
            isValidEmail: isEmail(action.email),
        }
    }

    if (action.type == c.UI_SUBMIT_NOTIFICATION_EMAIL) {
        return {
            ...state,
            emailSubmissionStatus: c.EMAIL_STATUS_SUBMITTING,
            emailSubmissionError:  null,
        }
    }

    if (action.type == c.UI_COMPLETE_NOTIFICATION_EMAIL) {
        if (action.success) {
            return {
                ...state,
                emailSubmissionStatus: c.EMAIL_STATUS_SUBMITTED,
                emailSubmissionError:  null,
            }
        }

        if (!action.success) {
            return {
                ...state,
                emailSubmissionStatus: c.EMAIL_STATUS_ERROR,
                emailSubmissionError:  action.errorMsg,
            }
        }
    }


    return state;
};

// ------------------------------------------------------------------------

function defaultState() {
    return {
        step:                  'EnterAmount',
        QRModalActive:         false,

        ...defaultEmailSubmissionState(),
    }
}

function defaultEmailSubmissionState() {
    return {
        email:                 '',
        isValidEmail:          false,
        emailSubmissionStatus: c.EMAIL_STATUS_NONE,
        emailSubmissionError:  null,
    }

}

export default uiStateReducer;

