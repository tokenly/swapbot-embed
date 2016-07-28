import c          from '../constants'
import actions    from '../actions'
import pusher     from '../lib/pusher/pusher'
import swapbotApi from '../lib/swapbotApi'
import currency   from '../lib/util/currency'
import request    from 'superagent';

let exports = {};

let connectionInfo = null;
let connectedBotId = null;

const DEBUG_SWAPSTREAM_EVENTS = (document.location.href.indexOf('_SBDEBUG') >= 0);

exports.respondToAction = (action, store) => {
    let state = store.getState();

    if (action.type == c.UI_COMPLETE_WALLET_COMFIRMATION_STEP) {
        beginListenForPayment(state, store);
    }

    if (action.type == c.UI_GO_TO_STEP && action.step != 'SendPayment' && action.step != 'WatchProgress') {
        endListenForPayment(state, store);
    }

    if (action.type == c.UI_GO_TO_STEP && action.step == 'SendPayment') {
        // reset all the settings
        endListenForPayment(state, store);
        beginListenForPayment(state, store);
    }

}

// ------------------------------------------------------------------------


function beginListenForPayment(state, store) {
    let botId = null;
    if (state.desiredSwap != null && state.desiredSwap.bot != null) {
        botId = state.desiredSwap.bot.id;
    }

    // tell the matched swap to start listening for payments
    setTimeout(()=>{
        let state = store.getState();
        let desiredSwap = state.desiredSwap;
        if (desiredSwap) {
            store.dispatch(actions.setDesiredSwapstreamSwap(desiredSwap))
        }
    }, 0);

    // subscribe to the bot feed and start listening for events
    if (botId != null && connectedBotId != botId) {
        connectionInfo = connectStoreForBotId(store, botId);
        connectedBotId = botId;
    }
}

function endListenForPayment(state, store) {
    if (connectedBotId) {
        disconnectStoreForBotId(connectionInfo);
        connectionInfo = {};
        connectedBotId = null;

        setTimeout(()=>{
            actions.clearDesiredSwapstreamSwap();
        });

    }
}


// ------------------------------------------------------------------------

const handleSwapstreamEvents = (swapstreamEvents, store) => {
    for (let swapstreamEvent of swapstreamEvents) {
        handleSwapstreamEvent(swapstreamEvent, store)
    }
}

const handleSwapstreamEvent = (swapstreamEvent, store) => {
    // console.log('handleSwapstreamEvent', swapstreamEvent);
    store.dispatch(actions.handleSwapstreamEvent(swapstreamEvent));
}


const SWAP_LOAD_LIMIT = 25;
let _debugEventOffset = 0;
const connectStoreForBotId = (store, botId) => {
    if (!DEBUG_SWAPSTREAM_EVENTS) {
        // load swapstream events from the API
        swapbotApi.getSwapsstreamEventsByBotId(botId, SWAP_LOAD_LIMIT).then((swapstreamEvents) => {
            handleSwapstreamEvents(swapstreamEvents, store);
        });
    }

    let heartbeatInterval = setInterval(()=>{
        store.dispatch(actions.swapstreamTimeHeartbeat());
    }, 5000);


    // -----------------------------------------------------
    if (DEBUG_SWAPSTREAM_EVENTS) {
        setTimeout(()=>{
            buildFakeSwapstreamEvent(0);
        }, 1);
        let debugSwapstreamInterval = setInterval(()=>{
            buildFakeSwapstreamEvent(++_debugEventOffset);
        }, 3500); // 3500 750

        let buildFakeSwapstreamEvent = (eventOffset) => {
            loadFakeSwapstreamEvents().then((data) => {
                let event = data[eventOffset];
                if (event != null) {
                    handleSwapstreamEvents([event], store);
                }
            });
        }

        return {
            debugSwapstreamInterval,
            heartbeatInterval,
        }
    }
    // -----------------------------------------------------



    // // subscribe to pusher
    // let client = pusher.subscribe({
    //     channel: 'quotebot_quote_all',
    //     onData: (newQuote) => {
    //         store.dispatch(actions.updateQuote(newQuote));
    //     },
    // });



}

const disconnectStoreForBotId = (connectionInfo) => {
    if (DEBUG_SWAPSTREAM_EVENTS) { clearInterval(connectionInfo.debugSwapstreamInterval); }
    clearInterval(connectionInfo.heartbeatInterval);
}


// ------------------------------------------------------------------------
// fake data for testing

let fakeSwapstreamEventsPromise = null;
function loadFakeSwapstreamEvents() {
    let URL = 'https://cdn.rawgit.com/deweller/831ac52e4ecd6af78406a5ff55940c1b/raw/17e99d4a86c5acc104e62a6af7f629b7822b59d4/sample-swapstream-events-01.json'
    // 'https://rawgit.com/deweller/831ac52e4ecd6af78406a5ff55940c1b/raw/17e99d4a86c5acc104e62a6af7f629b7822b59d4/sample-swapstream-events-01.json'

    if (fakeSwapstreamEventsPromise == null) {
        fakeSwapstreamEventsPromise = new Promise((resolve, reject) => {
            let req = request('GET', URL);
            req.end((error, res) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(res.body);
                }
            });

        });
    }

    return new Promise((resolve, reject) => {
        fakeSwapstreamEventsPromise.then(
            (data)=>{
                resolve(data);
            },
            (err)=>{
                throw new Error(err);
            }
        );
    });
}

// ------------------------------------------------------------------------


export default exports;


