var static = require('node-static');

let PORT         = process.env.PORT || 8080;
let CACHE_LENGTH = process.env.CACHE_LENGTH || 3600;

// 
// Create a node-static server instance to serve the './public' folder 
// 
var file = new static.Server('./public', { cache: CACHE_LENGTH });
 
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
})

.listen(PORT)

.on('listening', function() {
    console.log('Server listening on port '+PORT+' with cache length '+CACHE_LENGTH+'.');
});
