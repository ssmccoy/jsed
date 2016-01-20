#!/usr/bin/env node
// A tool for editing JSON streams!

var fs   = require("fs");
var args = require("args");

var options = args.Options.parse([
    {
        name         : "exec",
        shortName    : "e",
        type         : "string",
        help         : "Code to execute."
    },
    {
        name         : "indent",
        shortName    : "i",
        type         : "int",
        defaultValue : 4,
        help         : "Number of spaces to indent when printing."
    },
    {
        name         : "help",
        shortName    : "h",
        type         : "bool",
        help         : "This help message"
    }
]);

var optionParser = args.parser(process.argv)

/* Unfortunately this requires using exceptions for flow control... */
try {
    var config    = optionParser.parseToPositional(options);
}
catch (exception) {
    console.log(exception.message);
    process.exit(1);
}

if (config.help) {
    console.log("Usage: " + process.argv[0] + " [ FILENAME, ... ]");
    console.log();
    console.log(options.getHelp());
    process.exit(0);
}

var filenames = optionParser.getRest();

if (typeof config.exec !== "undefined") {
    var transform = new Function(config.exec);
}
else {
    var transform = function () { return this };
}

var padding = "";

for (var i = 0; i < config.indent; i++) {
    padding += " ";
}

function parseAndEmit (jsonString) {
    var object = JSON.parse( jsonString );

    var result = transform.apply(object);

    if (typeof result === "undefined") {
        result = object;
    }

    console.log( JSON.stringify(result, null, padding) );
}

if (filenames.length) {
    filenames.map(function (filename) {
        return fs.readFileSync(filename);
    }).forEach(function (jsonString) {
        parseAndEmit(jsonString);
    });

    process.exit(0);
}
else {
    var buffer = []

    /* There should be a synchronous way to do this, doing this asynchronously
     * buys us nothing...but node's APIs aren't the most consistent
     * unfortunately. */
    process.stdin.setEncoding("utf8");

    process.stdin.on("readable", function () {
        var chunk = process.stdin.read();

        if (chunk !== null) {
            buffer.push(chunk);
        }
    });

    process.stdin.on("end", function () {
        parseAndEmit(buffer.join(""));
        process.exit(0);
    });
}
