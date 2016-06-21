import Faye from '../../../node_modules/faye'

let exports = {};

// opts:
//   opts.channel (required)
//   opts.pusherURL (optional)
//   opts.onData (optional)
//   opts.onSubscribed (optional)

// returns the client reference
exports.subscribe = function(opts) {
    let channel = opts.channel;
    let pusherURL = opts.pusherURL || window.PUSHER_URL || 'https://pusher.tokenly.com'
    if (channel == null) { throw new Error("channel is required to subscribe to a pusher channel."); }
    if (pusherURL == null) { throw new Error("pusherURL is required to subscribe to a pusher channel."); }

    let client = new Faye.Client(pusherURL + "/public");
    client.subscribe("/" + channel, function(data) {
        if (opts.onData != null) {
            opts.onData(data);
        }
    }).then(function() {
        if (opts.onSubscribed != null) {
            opts.onSubscribed(channel);
        }
    });

    return client;
}

exports.close = function(client) {
    client.disconnect();
};

export default exports;

