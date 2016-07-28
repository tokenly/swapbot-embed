import swapstreamEventActionCreator from '../actionCreators/swapstreamEventActionCreator'


/**
 * 
 */
const swapstream = store => next => action => {
    let result = next(action)

    // apply swapstream changes
    swapstreamEventActionCreator.respondToAction(action, store);

    return result
}

export default swapstream;
