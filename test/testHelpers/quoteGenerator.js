
let generator = {}

generator.buildBTCQuote = (quote) => {
    return {
        'bitcoinAverage.USD:BTC': {
            last: 500,
            avg: 500,
            ...quote,
        }
    }
}



export default generator;