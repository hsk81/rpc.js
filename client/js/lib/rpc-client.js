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

    var add_n = 1, add_interval_id = {};
    var sub_n = 1, sub_interval_id = {};
    var mul_n = 1, mul_interval_id = {};
    var div_n = 1, div_interval_id = {};

    for (var add_i = 0; add_i < add_n; add_i++) {
        add_interval_id[add_i] = setInterval(function () {
            var pair = new Space.System.Pair({
                lhs: random(0, 256), rhs: random(0, 256)
            });

            var t = process.hrtime();
            system_service.api.add(pair, function (error, result) {
                if (error !== null) throw error;

                assert.equal(pair.lhs + pair.rhs, result.value);
                console.log('dT[add]:', process.hrtime(t));
            });
        }, 0);
    }

    for (var sub_i = 0; sub_i < sub_n; sub_i++) {
        sub_interval_id[sub_i] = setInterval(function () {
            var pair = new Space.System.Pair({
                lhs: random(0, 256), rhs: random(0, 256)
            });

            var t = process.hrtime();
            system_service.api.sub(pair, function (error, result) {
                if (error !== null) throw error;

                assert.equal(pair.lhs - pair.rhs, result.value);
                console.log('dT[sub]:', process.hrtime(t));
            });
        }, 0);
    }

    for (var mul_i = 0; mul_i < mul_n; mul_i++) {
        mul_interval_id[mul_i] = setInterval(function () {
            var pair = new Space.System.Pair({
                lhs: random(0, 256), rhs: random(0, 256)
            });

            var t = process.hrtime();
            system_service.api.mul(pair, function (error, result) {
                if (error !== null) throw error;

                assert.equal(pair.lhs * pair.rhs, result.value);
                console.log('dT[mul]:', process.hrtime(t));
            });
        }, 0);
    }

    for (var div_i = 0; div_i < div_n; div_i++) {
        div_interval_id[div_i] = setInterval(function () {
            var pair = new Space.System.Pair({
                lhs: random(0, 256), rhs: random(0, 256)
            });

            var t = process.hrtime();
            system_service.api.div(pair, function (error, result) {
                if (error !== null) throw error;
                var q = pair.lhs / pair.rhs;

                assert.ok(isNaN(q) === isNaN(result.value));
                assert.ok(isFinite(q) === isFinite(result.value));
                assert.ok(isFinite(q) === false ||
                    Math.abs(q - result.value) < 1E6);

                console.log('dT[div]:', process.hrtime(t));
            });
        }, 0);
    }

    setTimeout(function () {
        for (var add_key in add_interval_id)
            if (add_interval_id.hasOwnProperty(add_key))
                clearInterval(add_interval_id[add_key]);
        for (var sub_key in sub_interval_id)
            if (sub_interval_id.hasOwnProperty(sub_key))
                clearInterval(sub_interval_id[sub_key]);
        for (var mul_key in mul_interval_id)
            if (mul_interval_id.hasOwnProperty(mul_key))
                clearInterval(mul_interval_id[mul_key]);
        for (var div_key in div_interval_id)
            if (div_interval_id.hasOwnProperty(div_key))
                clearInterval(div_interval_id[div_key]);

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
