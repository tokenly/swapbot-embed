var fs = require('fs')

let HOSTURL = process.env.HOSTURL || 'https://swapbotembed.tokenly.com';

let REPLACEMENT = "// -- BEGIN HOSTURL --\n"+'$hosturl: "'+HOSTURL+'"'+"\n// -- END HOSTURL --";

let filePath = __dirname+'/../style/application.sass';
fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    let result = data.replace(/\/\/ -- BEGIN HOSTURL --[\s\S]*\/\/ -- END HOSTURL --/, REPLACEMENT);

    fs.writeFile(filePath, result, 'utf8', function (err) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    });
});

