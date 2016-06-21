import c from '../../constants'

const botReducer = (state={}, action) => {
    if (action.type == c.SET_SWAP_AND_BOT) {
        return action.bot
    }

    return state;
};

export default botReducer;

