#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////

var ArgumentParser = require('argparse').ArgumentParser,
    assert = require('assert'),
    now = require('performance-now');

var DizmoSpace = require('./rpc.js').DizmoSpace,
    Service = require('./rpc.js').Service;

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

var system_svc = new Service(url, DizmoSpace.SystemService, {
    '.SystemService.add': DizmoSpace.System.AddResult,
    '.SystemService.sub': DizmoSpace.System.SubResult,
    '.SystemService.mul': DizmoSpace.System.MulResult,
    '.SystemService.div': DizmoSpace.System.DivResult
});

/////////////////////////////////////////////////////////////////////)/////////
///////////////////////////////////////////////////////////////////////////////

system_svc.socket.on('open', function () {
    var intervalId = setInterval(function () {
        var pair = new DizmoSpace.System.Pair({
            lhs: random(0, 256), rhs: random(0, 256)
        });

        var t0 = now();
        system_svc.api.add(pair, function (error, result) {
            if (error !== null) throw error;

            assert.equal(pair.lhs + pair.rhs, result.value);
            console.log(now() - t0);
        });

        var t1 = now();
        system_svc.api.sub(pair, function (error, result) {
            if (error !== null) throw error;

            assert.equal(pair.lhs - pair.rhs, result.value);
            console.log(now() - t1);
        });
    }, 0);

    setTimeout(function () {
        clearInterval(intervalId);
        system_svc.socket.close();
    }, 10000);
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
