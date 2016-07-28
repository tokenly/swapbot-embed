import React from 'react'
import { connect } from 'react-redux';

import actions from '../actions';
import StepComponents from './steps';

// connect App to the Provider
let allConnectedSteps;


const MasterSwapUI = ({uiState}) => {
    let ActiveStepComponent = allConnectedSteps[uiState.step];

    return <div className="TKSB_ChooseSwapUI">
        <ActiveStepComponent />
    </div>
}


function connectSteps(StepComponents) {
    let connectedSteps = {};

    for (const stepId in StepComponents) {
        let connectFunctions = null;
        if (stepConnectors[stepId] != null) {
            connectFunctions = (stepConnectors[stepId])();
        } else {
            connectFunctions = stepConnectors.default(stepId);
        }

        connectedSteps[stepId] = connect(connectFunctions.mapStateToProps, connectFunctions.mapDispatchToProps)(StepComponents[stepId]);
    }

    return connectedSteps
}

let stepConnectors = {};
stepConnectors.default = () => {
    return {
        mapStateToProps: (state) => { return {}; },
        mapDispatchToProps: (dispatch) => { return {}; },
    }
}
stepConnectors.EnterAmount = () => {
    return {
        mapStateToProps: (state) => {
            return {
                swapObjects: state.swapObjects,
                desiredSwap: state.desiredSwap,
            }
        },
        mapDispatchToProps: (dispatch) => {
            return {
                setOutToken: (token) => {
                    dispatch(actions.setOutToken(token));
                },
                setOutTokenQuantity: (quantity) => {
                    dispatch(actions.setOutTokenQuantity(quantity));
                },
                setInToken: (token) => {
                    dispatch(actions.setInToken(token));
                },
                setInTokenQuantity: (quantity) => {
                    dispatch(actions.setInTokenQuantity(quantity));
                },
                completeEnterAmountStep: () => {
                    dispatch(actions.completeEnterAmountStep());
                },
            };
        },
    }
};
stepConnectors.ConfirmWallet = () => {
    return {
        mapStateToProps: (state) => {
            return {
            }
        },
        mapDispatchToProps: (dispatch) => {
            return {
                completeWalletConfirmationStep: () => {
                    dispatch(actions.completeWalletConfirmationStep());

                    // start monitoring swap events
                },
                goBack: () => {
                    dispatch(actions.goToStep('EnterAmount'));

                    // stop monitoring swap events
                },

                launchWindow: (url) => {
                    window.open(url, 'New Window');
                }
            };
        },
    }
};
stepConnectors.SendPayment = () => {
    return {
        mapStateToProps: (state) => {
            return {
                desiredSwap:   state.desiredSwap,
                bot:           state.desiredSwap.bot,
                QRModalActive: state.uiState.QRModalActive,
            }
        },
        mapDispatchToProps: (dispatch) => {
            return {
                goBack: () => { dispatch(actions.goToStep('EnterAmount')); },
                showQRModal: () => { dispatch(actions.showQRModal()); },
                hideQRModal: () => { dispatch(actions.hideQRModal()); },
            };
        },
    }
};
stepConnectors.WatchProgress = () => {
    return {
        mapStateToProps: (state) => {
            return {
                desiredSwap: state.desiredSwap,
                swap:        state.matchedSwap.matchedSwap,
                bot:         state.desiredSwap.bot,
            }
        },
        mapDispatchToProps: (dispatch) => {
            return {
                goBack: () => { dispatch(actions.goToStep('SendPayment')); },
            };
        },
    }
};

allConnectedSteps = connectSteps(StepComponents);

export default MasterSwapUI;
