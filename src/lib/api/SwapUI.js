import React                            from 'react';
import ReactDOM                         from 'react-dom';
import { Provider, connect }            from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import actions                          from '../../actions';
import MasterSwapUIComponent            from '../../components/masterSwapUI';
import reducers                         from '../../reducers';
import quoteBotActionCreator            from '../../actionCreators/quoteBotActionCreator'


let SwapUI = {};

SwapUI.show = (selectorOrElement, swapObjects, opts) => {
    // create the store
    const createStoreWithMiddleware = applyMiddleware()(createStore);

    // resolve the domElement
    let domElement = resolveSelector(selectorOrElement)

    if (domElement == null) {
        throw new Error("Unable initialize the swap UI because we couldn't find a domElement for the provided selector.");
    }

    // build a new, empty dom element for the application
    while (domElement.firstChild) { domElement.removeChild(domElement.firstChild); }
    let appContainerElement = document.createElement("div");
    appContainerElement.setAttribute('data-swapbot-embed', '');
    domElement.appendChild(appContainerElement);

    // create the store
    let store = createStoreWithMiddleware(reducers);

    let ConnectedSwapUIComponent = connectMasterSwapUIComponent(MasterSwapUIComponent);

    let doRender = ()=>{
        ReactDOM.render(
            <Provider store={store}>
                <ConnectedSwapUIComponent />
            </Provider>
            , appContainerElement
        );
    }

    // subscribe the render method to the store
    store.subscribe(doRender);
    doRender();

    if (swapObjects != null && swapObjects.length > 0) {
        // update the swapObjects
        store.dispatch(actions.setSwapObjects(swapObjects));

        // choose the first token by default
        store.dispatch(actions.setOutToken(swapObjects[0].swap.out));
    }

    // connect the action creators
    quoteBotActionCreator.connectStore(store);

    return appContainerElement;
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