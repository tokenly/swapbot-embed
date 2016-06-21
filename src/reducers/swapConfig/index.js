import c from '../../constants'

const swapConfigReducer = (state={}, action) => {
    if (action.type == c.SET_SWAP_AND_BOT) {
        // set the new swap config
        return action.swapConfig
    }

    return state;
};

export default swapConfigReducer;

