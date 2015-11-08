#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////

var ArgumentParser = require('argparse').ArgumentParser,
    moment = require('moment'),
    sprintf = require('sprintf-js').sprintf,
    WebSocket = require('ws');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var parser = new ArgumentParser({
  addHelp: true, description: 'RPC Client', version: '0.0.1'
});

parser.addArgument(['port'], {
    nargs: '?', help: 'Server Port', defaultValue: '8088'
});
parser.addArgument(['host'], {
    nargs: '?', help: 'Server Host', defaultValue: 'localhost'
});
parser.addArgument(['tpl'], {
    nargs: '?', help: 'Output Template', defaultValue: '{diff}'
});

///////////////////////////////////////////////////////////////////////////////

var args = parser.parseArgs();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var ws = new WebSocket('ws://{host}:{port}'
    .replace('{host}', args.host)
    .replace('{port}', args.port)
);

///////////////////////////////////////////////////////////////////////////////

ws.onmessage = function (ev) {

    var next = moment(),
        diff = next.diff(GLOBAL.last || moment(), true);

    GLOBAL.last = next;

    console.log(args.tpl
        .replace('{last}', last.toISOString())
        .replace('{diff}', sprintf('%03f', diff))
        .replace('{next}', next.toISOString())
        .replace('{data}', ev.data));
};

///////////////////////////////////////////////////////////////////////////////

ws.onopen = function () {
    var id = setInterval(function () { ws.send('.')}, 0);
    setTimeout(function () { clearInterval(id); ws.close(); }, 10000);
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
