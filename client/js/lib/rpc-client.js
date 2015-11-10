#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////

var ArgumentParser = require('argparse').ArgumentParser,
    ProtoBuf = require('protobufjs'),
    now = require('performance-now'),
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

///////////////////////////////////////////////////////////////////////////////

var args = parser.parseArgs();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var CoreFactory = ProtoBuf.loadProtoFile({
    root: __dirname + '/../../../protocol', file: 'core.proto'
});

var Core = CoreFactory.build();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var ws = new WebSocket('ws://' + args.host + ':' + args.port);

///////////////////////////////////////////////////////////////////////////////

ws.onmessage = function (ev) {
    var ts = new Core.Timestamp.decode(ev.data);
    console.log(now() - ts.value);
};

///////////////////////////////////////////////////////////////////////////////

ws.onopen = function () {
    var ts = new Core.Timestamp();
    var id = setInterval(function () {
        ts.value = now();
        ws.send(ts.toBuffer(), {
            binary: true
        });
    }, 0);

    setTimeout(function () {
        clearInterval(id);
        ws.close();
    }, 10000);
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
