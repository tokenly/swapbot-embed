import c from '../../constants'

const swapObjectsReducer = (state=[], action) => {
    if (action.type == c.SET_POSSIBLE_SWAP_OBJECTS) {
        // set the new swap config
        return action.swapObjects
    }

    return state;
};

export default swapObjectsReducer;

