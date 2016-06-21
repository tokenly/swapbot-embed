import React from 'react'

const Swap = ({swapConfig, onChangeInTokenClick}) => {
    return <div className="swap-config">
        <h1>Your Swap</h1>
        <p>Sending {swapConfig.in} and receiving {swapConfig.out}</p>
        <button onClick={() => { onChangeInTokenClick('XCP')} } type="button" className="btn btn-default">Change Me</button>
    </div>
}

export default Swap;