import numeral            from 'numeral'
import c                  from '../../src/constants'
import actions            from '../../src/actions'
import matchedSwapReducer from '../../src/reducers/matchedSwap'

let helper = {}

helper.applySwapstreamEventsForPossibleSwap = (state, id=1, overrides={}, swapstreamEventOverrides={}) => {
    let event = helper.generateSwapstreamEvent(id, overrides, swapstreamEventOverrides);
    return matchedSwapReducer(state, actions.handleSwapstreamEvent(event));
}

helper.swapUuid = (id) => {
    return "11111111-1111-1111-1111-"+pad(id, 12);
}

helper.generateSwapstreamEvent = (id=1, overrides={}, swapstreamEventOverrides={}) => {
    let idSuffix = pad(id, 12);

    let event = {
        "assetIn": "BTC",
        "assetOut": "TOKENLY",
        "confirmations": "0",
        "destination": "1AAAA2222xxxxxxxxxxxxxxxxxxy4pQ3tU",
        "isComplete": false,
        "isError": false,
        "name": "swap.transaction.update",
        "quantityIn": 0.025,
        "quantityOut": 2,
        "state": "ready",
        "txidIn": "333333333333333333333333333333333333333333333333abcdef1111111234",
        ...overrides
    };

    let swapstreamEvent = {
        "createdAt": "2016-07-27T23:27:35+0000",
        "event": event,
        "id": "77b4bd7f-db5b-4e37-be9c-"+idSuffix,
        "level": 200,
        "message": "Received 0.025 BTC from 1AAAA2222xxxxxxxxxxxxxxxxxxy4pQ3tU with 0 confirmations.",
        "serial": 1469662051813,
        "swapUuid": helper.swapUuid(id),
        ...swapstreamEventOverrides
    }

    return swapstreamEvent;
}



function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

export default helper;