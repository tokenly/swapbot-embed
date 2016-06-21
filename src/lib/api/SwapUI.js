import React                            from 'react';
import ReactDOM                         from 'react-dom';
import { Provider, connect }            from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import actions                          from '../../actions';
import MasterSwapUIComponent            from '../../components/masterSwapUI';
import reducers                         from '../../reducers';
import quoteBotActionCreator            from '../../actionCreators/quoteBotActionCreator'


let SwapUI = {};

SwapUI.show = (selectorOrElement, swapObject, opts) => {

    // create the store
    const createStoreWithMiddleware = applyMiddleware()(createStore);

    // resolve the domElement
    let domElement = resolveSelector(selectorOrElement)

    // create the store
    let store = createStoreWithMiddleware(reducers);

    let ConnectedSwapUIComponent = connectMasterSwapUIComponent(MasterSwapUIComponent);

    let doRender = ()=>{
        ReactDOM.render(
            <Provider store={store}>
                <ConnectedSwapUIComponent />
            </Provider>
            , domElement
        );
    }

    // subscribe the render method to the store
    store.subscribe(doRender);
    doRender();

    if (swapObject != null) {
        // update the swap and bot
        store.dispatch(actions.setChosenSwapConfigAndBot(swapObject.swap, swapObject.bot));
    }

    // connect the action creators
    quoteBotActionCreator.connectStore(store);
}

// ------------------------------------------------------------------------

function connectMasterSwapUIComponent(MasterSwapUIComponent) {
    // connect App to the Provider
    let mapStateToProps = (state) => {
        return {
            swapConfig: state.swapConfig,
            uiState: state.uiState,
        }
    }

    let mapDispatchToProps = (dispatch) => {
        return {
            // onChangeInTokenClick: (newInToken) => {
            //     let action = debugSetInToken(newInToken)
            //     dispatch(debugSetInToken(newInToken))
            // }
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(MasterSwapUIComponent);
}

function resolveSelector(selectorOrElement) {
    if (selectorOrElement.tagName != null) {
        return selectorOrElement;
    }

    return document.querySelector(selectorOrElement);
}

export default SwapUI;