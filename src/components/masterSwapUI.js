import React from 'react'
import { connect } from 'react-redux';

import actions from '../actions';
import StepComponents from './steps';

// connect App to the Provider
let allConnectedSteps;


const MasterSwapUI = ({uiState}) => {
    let ActiveStepComponent = allConnectedSteps[uiState.step];

    return <div id="TKSB_ChooseSwapUI">
        <p>This is the Swapbot UI Container</p>
        <span>
            <ActiveStepComponent />
        </span>
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
                bot: state.bot,
                swapConfig: state.swapConfig,
                desiredSwap: state.desiredSwap,
                uiState: state.uiState,
            }
        },
        mapDispatchToProps: (dispatch) => {
            return {
                setOutTokenAmount: (amount, bot, swapConfig) => {
                    dispatch(actions.setOutTokenAmount(amount, bot, swapConfig));
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
                },
                goBack: () => {
                    dispatch(actions.goToStep('EnterAmount'));
                },
            };
        },
    }
};
stepConnectors.SendPayment = () => {
    return {
        mapStateToProps: (state) => {
            return {
                bot: state.bot,
                swapConfig: state.swapConfig,
                desiredSwap: state.desiredSwap,
            }
        },
        mapDispatchToProps: (dispatch) => {
            return {
                goBack: () => {
                    dispatch(actions.goToStep('EnterAmount'));
                },
            };
        },
    }
};

allConnectedSteps = connectSteps(StepComponents);

export default MasterSwapUI;
