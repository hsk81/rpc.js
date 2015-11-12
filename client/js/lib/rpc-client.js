#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////

var ArgumentParser = require('argparse').ArgumentParser,
    assert = require('assert'),
    now = require('performance-now');

var Space = require('./rpc.js').Space,
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

var system_service = new Service(url, Space.System.Service, {
    '.System.Service.add': Space.System.AddResult,
    '.System.Service.sub': Space.System.SubResult,
    '.System.Service.mul': Space.System.MulResult,
    '.System.Service.div': Space.System.DivResult
});

/////////////////////////////////////////////////////////////////////)/////////
///////////////////////////////////////////////////////////////////////////////

system_service.socket.on('open', function () {

    var intervalId0 = setInterval(function () {
        var pair = new Space.System.Pair({
            lhs: random(0, 256), rhs: random(0, 256)
        });

        var t0 = now();
        system_service.api.add(pair, function (error, result) {
            if (error !== null) throw error;

            assert.equal(pair.lhs + pair.rhs, result.value);
            console.log('T0:', now() - t0);
        });
    }, 0);

    var intervalId1 = setInterval(function () {
        var pair = new Space.System.Pair({
            lhs: random(0, 256), rhs: random(0, 256)
        });

        var t1 = now();
        system_service.api.sub(pair, function (error, result) {
            if (error !== null) throw error;

            assert.equal(pair.lhs - pair.rhs, result.value);
            console.log('T1:', now() - t1);
        });
    }, 0);

    var intervalId2 = setInterval(function () {
        var pair = new Space.System.Pair({
            lhs: random(0, 256), rhs: random(0, 256)
        });

        var t2 = now();
        system_service.api.mul(pair, function (error, result) {
            if (error !== null) throw error;

            assert.equal(pair.lhs * pair.rhs, result.value);
            console.log('T2:', now() - t2);
        });
    }, 0);

    var intervalId3 = setInterval(function () {
        var pair = new Space.System.Pair({
            lhs: random(0, 256), rhs: random(0, 256)
        });

        var t3 = now();
        system_service.api.div(pair, function (error, result) {
            if (error !== null) throw error;

            assert.ok(isNaN(pair.lhs / pair.rhs) === isNaN(result.value));
            assert.ok(isFinite(pair.lhs/ pair.rhs) === isFinite(result.value));
            assert.ok(isFinite(pair.lhs/ pair.rhs) === false ||
                Math.abs(pair.lhs / pair.rhs - result.value) < 1E6);

            console.log('T3:', now() - t3);
        });
    }, 0);

    setTimeout(function () {
        clearInterval(intervalId0);
        clearInterval(intervalId1);
        clearInterval(intervalId2);
        clearInterval(intervalId3);
        system_service.socket.close();
    }, 10000);
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
