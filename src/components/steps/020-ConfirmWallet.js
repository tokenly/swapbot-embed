import React from 'react'

const ConfirmWalletComponent = ({goBack, completeWalletConfirmationStep}) => {
    return <div className="TKSB_confirm-wallet">
        <h1>Step 2: Confirm Your Wallet</h1>
        <p>I am using a Counter Party Wallet</p>
        <button onClick={completeWalletConfirmationStep} type="button" className="btn btn-success">Yes</button>
        <a href="http://google.com" target="_blank" className="btn btn-danger">No</a>
        <a href="http://google.com" target="_blank" className="btn btn-warning">I don't know</a>
        <div className="nav">
            <a onClick={() => { goBack(); }} href="#back">Back</a>
        </div>
    </div>
}

export default ConfirmWalletComponent;