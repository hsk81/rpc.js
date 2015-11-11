#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////

var ArgumentParser = require('argparse').ArgumentParser,
    assert = require('assert'),
    now = require('performance-now'),
    RPC = require('./rpc.js');

var Core = RPC.Core,
    Service = RPC.Service;

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

var url = 'ws://' + args.host + ':' + args.port;

///////////////////////////////////////////////////////////////////////////////

var calculator = new Service(url, Core.Calculator.Service, {
    '.Calculator.Service.add': Core.Calculator.Result,
    '.Calculator.Service.sub': Core.Calculator.Result,
    '.Calculator.Service.mul': Core.Calculator.Result,
    '.Calculator.Service.div': Core.Calculator.Result
});

/////////////////////////////////////////////////////////////////////)/////////
///////////////////////////////////////////////////////////////////////////////

calculator.socket.on('open', function () {
    var intervalId = setInterval(function () {
        var pair = new Core.Calculator.Pair({
            lhs: random(0, 256), rhs: random(0, 256)
        });

        var t0 = now();
        calculator.api.add(pair, function (error, result) {
            if (error !== null) throw error;

            assert.equal(pair.lhs + pair.rhs, result.value);
            console.log(now() - t0);
        });

        var t1 = now();
        calculator.api.sub(pair, function (error, result) {
            if (error !== null) throw error;

            assert.equal(pair.lhs - pair.rhs, result.value);
            console.log(now() - t1);
        });
    }, 0);

    setTimeout(function () {
        clearInterval(intervalId);
        calculator.socket.close();
    }, 10000);
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
