import actions     from '../actions'
import quotebotApi from '../lib/quotebot/api'
import pusher      from '../lib/pusher/pusher'

let exports = {};

let quote = {
    'bitcoinAverage.USD:BTC': {
        last: 500,
        avg: 500
    }
};
exports.connectStore = (store) => {
    // load from API
    let connectionUrl = window.QUOTEBOT_CONNECTION_URL || 'https://quotebot.tokenly.com';
    let apiToken      = window.QUOTEBOT_APITOKEN || 'T70Tz0UjJcHWM1uH';
    let quotebotConnection = quotebotApi.connect(connectionUrl, apiToken);
    quotebotConnection.getQuotes().then((quotes) => {
        store.dispatch(actions.setCurrentQuotes(quotes));
    });


    // subscribe to pusher
    let client = pusher.subscribe({
        channel: 'quotebot_quote_all',
        onData: (newQuote) => {
            store.dispatch(actions.updateQuote(newQuote));
        },
    });

}

export default exports;


