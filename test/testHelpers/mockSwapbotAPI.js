
let mockSwapbotAPI = {}

mockSwapbotAPI.buildSendHttpRequestMock = ()=>{
    return () => {
        return new Promise((resolve, reject) => {
            resolve(getFakeSwaps());
        });
    }
}

function getFakeSwaps() {
    return [
        {
            bot: {name: "My Bot", id: "xxxxxx"},
            swap: {cost: 1, tokenIn: "BTC", tokenOut: 'TOKELY'}
        }
    ];
}

export default mockSwapbotAPI;