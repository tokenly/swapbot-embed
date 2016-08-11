import c          from '../constants'
import actions    from '../actions'
import pusher     from '../lib/pusher/pusher'
import swapbotApi from '../lib/swapbotApi'
import currency   from '../lib/util/currency'
import request    from 'superagent';

let exports = {};

let connectionInfo = {};

const DEBUG_SWAPSTREAM_EVENTS = (document.location.href.indexOf('_SBDEBUG') >= 0);

exports.respondToAction = (action, store) => {
    let state = store.getState();

    if (action.type == c.UI_COMPLETE_WALLET_COMFIRMATION_STEP) {
        beginListenForPayment(state, store);
    }

    if (action.type == c.UI_GO_TO_STEP && action.step != 'SendPayment' && action.step != 'WatchProgress') {
        endListenForPayment(state, store);
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
    if (botId != null && connectionInfo.botId != botId) {
        connectionInfo = connectStoreForBotId(store, botId);
    }
}

function endListenForPayment(state, store) {
    if (connectionInfo.botId) {
        disconnectStoreForBotId(connectionInfo);
        connectionInfo = {};

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
const connectStoreForBotId = (store, botId) => {

    // -----------------------------------------------------
    if (DEBUG_SWAPSTREAM_EVENTS) {
        return DEBUG_connectStoreForBotId(store, botId);
    }
    // -----------------------------------------------------

    // start a heartbeat to update the time display for each potential swap
    let heartbeatInterval = setInterval(()=>{
        store.dispatch(actions.swapstreamTimeHeartbeat());
    }, 5000);


    // load swapstream events from the API as soon as the websocket is subscribed
    let onSubscribed = () => {
        swapbotApi.getSwapsstreamEventsByBotId(botId, SWAP_LOAD_LIMIT).then((swapstreamEvents) => {
            handleSwapstreamEvents(swapstreamEvents, store);
        });
    }

    // subscribe to the pusher channel
    let pusherClient = pusher.subscribe({
        channel: 'swapbot_swapstream_'+botId,
        onData: (event) => {
            handleSwapstreamEvent(event, store);
        },
        onSubscribed: onSubscribed
    });

    return {
        botId,
        pusherClient,
        heartbeatInterval,
    }
}

const disconnectStoreForBotId = (connectionInfo) => {
    clearInterval(connectionInfo.heartbeatInterval);

    if (connectionInfo.debugSwapstreamInterval != null) {
        clearInterval(connectionInfo.debugSwapstreamInterval);
    }

    if (connectionInfo.pusherClient != null) {
        pusher.close(connectionInfo.pusherClient);
    }
}


// ------------------------------------------------------------------------
// DEBUG

const FAKE_SWAPSTREAM_UPDATE_DELAY  = 3500; // ms
const FAKE_SWAPSTREAM_INITIAL_DELAY = 1;    // ms
// const FAKE_SWAPSTREAM_UPDATE_DELAY     = 6000; // ms
// const FAKE_SWAPSTREAM_INITIAL_DELAY    = 5000; // ms

let _debugEventOffset = 0;
const DEBUG_connectStoreForBotId = (store, botId) => {
    _debugEventOffset = 0;

    let heartbeatInterval = setInterval(()=>{
        store.dispatch(actions.swapstreamTimeHeartbeat());
    }, 5000);

    setTimeout(()=>{
        // load the first 3 events immediately to populate the choices
        buildFakeSwapstreamEvent(0);
        buildFakeSwapstreamEvent(++_debugEventOffset);
        buildFakeSwapstreamEvent(++_debugEventOffset);
    }, FAKE_SWAPSTREAM_INITIAL_DELAY);

    let debugSwapstreamInterval = setInterval(()=>{
        buildFakeSwapstreamEvent(++_debugEventOffset);
    }, FAKE_SWAPSTREAM_UPDATE_DELAY); // 3500 750

    let buildFakeSwapstreamEvent = (eventOffset) => {
        loadFakeSwapstreamEvents().then((data) => {
            let event = data[eventOffset];
            if (event != null) {
                handleSwapstreamEvents([event], store);
            }
        });
    }

    return {
        botId,
        debugSwapstreamInterval,
        heartbeatInterval,
    }
}


// ------------------------------------------------------------------------
// fake data for testing

let fakeSwapstreamEventsPromise = null;
function loadFakeSwapstreamEvents() {
    // cached with low latency
    let URL = 'https://cdn.rawgit.com/deweller/831ac52e4ecd6af78406a5ff55940c1b/raw/c753b5393c4773c4d7cc1029d736ddda70c16083/sample-swapstream-events-01.json';

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


