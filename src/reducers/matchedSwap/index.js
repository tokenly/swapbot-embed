import c           from '../../constants'
import swapMatcher from './swapMatcher'
import moment      from 'moment'

const matchedSwapReducer = (state=null, action) => {
    if (state == null) { state = buildDefaultState(); }

    if (action.type == c.SWAPSTREAM_SET_DESIRED_SWAP) {
        // console.log('c.SWAPSTREAM_SET_DESIRED_SWAP');
        return {
            ...state,
            ...buildDefaultState(),
            desiredSwap: action.desiredSwap,
        }
    }
    if (action.type == c.SWAPSTREAM_CLEAR_DESIRED_SWAP) {
        // keep any userIgnoredSwapIds
        let userIgnoredSwapIds = state.userIgnoredSwapIds;

        return {
            ...state,
            ...buildDefaultState(),
            userIgnoredSwapIds,
        }
    }

    if (action.type == c.CHOOSE_MY_SWAP) {
        console.log('CHOOSE_MY_SWAP action.swap.isComplete', action.swap.isComplete);
        return {
            ...state,
            matchedSwap: action.swap,
        }
    }

    if (action.type == c.SWAPSTREAM_TIME_HEARTBEAT) {
        if (state.matchedSwap != null) {
            return buildStateWithNewMatchedSwap(state, state.matchedSwap);
        }

        // no matched swap yet
        return buildStateWithNewSwaps(state, state.possibleMatchedSwapsMap);
    }


    if (action.type == c.SWAPSTREAM_EVENT) {
        let swapEventData = swapMatcher.extractSwapFromEvent(action.event);

        if (state.matchedSwap != null && swapEventData.id == state.matchedSwap.id) {
            // this is an update for the matched swap
            console.log('update matched swap');
            let newMatchedSwap = swapMatcher.mergeSwapData(state.matchedSwap, swapEventData);
            return buildStateWithNewMatchedSwap(state, newMatchedSwap);
        }

        if (state.matchedSwap == null && state.desiredSwap != null) {
            // merge this data with any existing data
            let mergedSwap = swapMatcher.findAndMergeEventDataWithPossibleMatchedSwap(swapEventData, state.possibleMatchedSwapsMap);

            // no matched swap yet
            if (swapMatcher.isPossibleSwapMatch(mergedSwap, state.desiredSwap)) {
                let possibleMatchedSwapsMap = swapMatcher.mergePossibleMatchedSwap(mergedSwap, state.possibleMatchedSwapsMap);
                return buildStateWithNewSwaps(state, possibleMatchedSwapsMap);
            } else {
                // remove the swap if necessary
                let possibleMatchedSwapsMap = swapMatcher.removePossibleSwap(mergedSwap, state.possibleMatchedSwapsMap);
                return buildStateWithNewSwaps(state, possibleMatchedSwapsMap);
            }
        }

    }

    return {
        ...state,
    }
}

// ------------------------------------------------------------------------

function buildStateWithNewSwaps(state, possibleMatchedSwapsMap) {
    let newState = {
        ...state,
    }

    newState.possibleMatchedSwapsArray = [];
    for (let swapId in possibleMatchedSwapsMap) {
        let swap = possibleMatchedSwapsMap[swapId];

        // update fromNow
        let ts = swap.completedAt ? swap.completedAt : swap.updatedAt
        swap.fromNow = moment(ts).fromNow()

        newState.possibleMatchedSwapsArray.push(swap);
    }
    newState.anyMatchedSwapsExist = (newState.possibleMatchedSwapsArray.length > 0);

    return newState;
}

function buildStateWithNewMatchedSwap(state, swap) {
    // update fromNow
    let ts = swap.completedAt ? swap.completedAt : swap.updatedAt
    swap.fromNow = moment(ts).fromNow()

    return {
        ...state,
        matchedSwap: swap,
    };
}

let buildDefaultState = function() {
    return {
        desiredSwap:               null,
        matchedSwap:               null,
        possibleMatchedSwapsMap:   {},
        possibleMatchedSwapsArray: [],
        anyMatchedSwapsExist:      false,
        userIgnoredSwapIds:        {},
    }
}

export default matchedSwapReducer;

