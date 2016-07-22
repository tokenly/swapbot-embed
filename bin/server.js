var static = require('node-static');

let PORT         = process.env.PORT         || 8080;
let CACHE_LENGTH = process.env.CACHE_LENGTH || 3600;

// 
// Create a node-static server instance to serve the './public' folder 
// 
var file = new static.Server('./public', {
    cache: CACHE_LENGTH,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Headers': '*'
    }
});
 
require('http').createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', '*');
    if ( request.method === 'OPTIONS' ) {
        response.writeHead(200);
        response.end();
        return;
    }

    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
})

.listen(PORT)

.on('listening', function() {
    console.log('Server listening on port '+PORT+' with cache length '+CACHE_LENGTH+'.');
});
