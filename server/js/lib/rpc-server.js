#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////

var ArgumentParser = require('argparse').ArgumentParser,
    assert = require('assert'),
    ProtoBuf = require('protobufjs'),
    WebSocket = require('ws');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var parser = new ArgumentParser({
    addHelp: true, description: 'RPC Server', version: '0.0.1'
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

var wss = new WebSocket.Server({
    host: args.host, port: args.port
});

wss.on('connection', function (ws) {
    var pair, result;

    ws.on('message', function (data, opts) {
        var service_req = Core.Service.Request.decode(data);
        if (service_req.name === '.System.Service.add') {
            pair = Core.System.Pair.decode(service_req.data);
            result = new Core.System.AddResult({
                value: pair.lhs + pair.rhs
            });
        }

        else if (service_req.name === '.System.Service.sub') {
            pair = Core.System.Pair.decode(service_req.data);
            result = new Core.System.SubResult({
                value: pair.lhs - pair.rhs
            });
        }

        else if (service_req.name === '.System.Service.mul') {
            pair = Core.System.Pair.decode(service_req.data);
            result = new Core.System.MulResult({
                value: pair.lhs * pair.rhs
            });
        }

        else if (service_req.name === '.System.Service.div') {
            pair = Core.System.Pair.decode(service_req.data);
            result = new Core.System.DivResult({
                value: pair.lhs / pair.rhs
            });
        }

        else {
            throw(new Error(service_req.name + ': not suported'));
        }

        var service_res = new Core.Service.Response({
            id: service_req.id, data: result.toBuffer()
        });

        ws.send(service_res.toBuffer());
    });
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
