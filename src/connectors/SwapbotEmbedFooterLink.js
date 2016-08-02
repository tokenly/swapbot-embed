import { connect }            from 'react-redux';
import React                  from 'react'
import SwapbotEmbedFooterLink from '../components/includes/SwapbotEmbedFooterLink'

// connect the embed footer
let mapStateToProps = (state) => {
    return {
        desiredSwap: state.desiredSwap
    }
};
let ConnectedSwapbotEmbedFooterLink = connect(mapStateToProps)(SwapbotEmbedFooterLink);

// ------------------------------------------------------------------------


export default ConnectedSwapbotEmbedFooterLink;
