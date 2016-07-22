import React from 'react'
import { connect } from 'react-redux';

const SwapbotEmbedFooterLink = (props) => {
    return <span className="embed-footer-link">
            a <a href="#">swapbot</a> powered by <a target="_blank" href="https://tokenly.com">tokenly</a>
        </span>
}

// connect the embed footer
let mapStateToProps = (state) => {
    return {
        desiredSwap: state.desiredSwap
    }
};
let ConnectedSwapbotEmbedFooterLink = connect(mapStateToProps)(SwapbotEmbedFooterLink);

// ------------------------------------------------------------------------


export default ConnectedSwapbotEmbedFooterLink;
