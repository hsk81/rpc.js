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

var DizmoSpaceFactory = ProtoBuf.loadProtoFile({
    root: __dirname + '/../../../protocol', file: 'dizmo-space.proto'
});

var DizmoSpace = DizmoSpaceFactory.build();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var wss = new WebSocket.Server({
    host: args.host, port: args.port
});

wss.on('connection', function (ws) {
    ws.on('message', function (data, opts) {
        var rpc_req = DizmoSpace.Rpc.Request.decode(data),
            pair = DizmoSpace.System.Pair.decode(rpc_req.data),
            result;

        if (rpc_req.name === '.SystemService.add') {
            result = new DizmoSpace.System.AddResult({
                value: pair.lhs + pair.rhs
            });
        }

        else if (rpc_req.name === '.SystemService.sub') {
            result = new DizmoSpace.System.SubResult({
                value: pair.lhs - pair.rhs
            });
        }

        else if (rpc_req.name === '.SystemService.mul') {
            result = new DizmoSpace.System.MulResult({
                value: pair.lhs * pair.rhs
            });
        }

        else if (rpc_req.name === '.SystemService.div') {
            result = new DizmoSpace.System.DivResult({
                value: pair.lhs / pair.rhs
            });
        }

        else {
            throw(new Error(rpc_req.name + ': not suported'));
        }

        var rpc_res = new DizmoSpace.Rpc.Response({
            id: rpc_req.id, data: result.toBuffer()
        });

        ws.send(rpc_res.toBuffer());
    });
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
