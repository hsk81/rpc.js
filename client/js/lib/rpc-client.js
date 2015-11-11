#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////

var ArgumentParser = require('argparse').ArgumentParser,
    assert = require('assert'),
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

var Service = {build: function (entity_cls, result_cls) {
    var handler = {};
    return function (socket) {
        socket.on('message', function (data) {
            var service_res = Core.Service.Response.decode(data);
            handler[service_res.id](service_res.data);
        });

        return new entity_cls(function (method, req, callback) {
            var service_req = new Core.Service.Request({
                name: method, id: next(0,(1<<16)*(1<<16)), data: req.toBuffer()
            });

            handler[service_req.id] = function (data) {
                callback(null, result_cls.decode(data));
            };

            socket.send(service_req.toBuffer(), function (error) {
                if (error) {
                    delete handler[service_req.id];
                    callback(error, null);
                }
            });
        });
    };
}};

///////////////////////////////////////////////////////////////////////////////

var Calculator = Service.build(
    Core.Calculator.Service, Core.Calculator.Result);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var ws = new WebSocket('ws://' + args.host + ':' + args.port);

///////////////////////////////////////////////////////////////////////////////

ws.onopen = function () {
    var calculator = Calculator(ws);

    var id = setInterval(function () {
        var pair = new Core.Calculator.Pair({
            lhs: next(0, 256), rhs: next(0, 256)
        });

        var add_now = now();
        calculator.add(pair, function (error, result) {
            if (error !== null) throw error;
            assert.equal(pair.lhs + pair.rhs, result.value);
            console.log(now() - add_now);
        });

        var sub_now = now();
        calculator.sub(pair, function (error, result) {
            if (error !== null) throw error;
            assert.equal(pair.lhs - pair.rhs, result.value);
            console.log(now() - sub_now);
        });

        var mul_now = now();
        calculator.mul(pair, function (error, result) {
            if (error !== null) throw error;
            assert.equal(pair.lhs * pair.rhs, result.value);
            console.log(now() - mul_now);
        });

        var div_now = now();
        calculator.div(pair, function (error, result) {
            if (error !== null) throw error;
            if (isFinite(result.value) && !isNaN(result.value))
                assert.ok(Math.abs(pair.lhs / pair.rhs - result.value) < 0.1);
            console.log(now() - div_now);
        });
    }, 0);

    setTimeout(function () {
        clearInterval(id);
        ws.close();
    }, 10000);
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function next(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
