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

parser.addArgument(['-a', '--n-add'], {
    nargs: '?', help: 'ADD Workers', defaultValue: 1
});
parser.addArgument(['-s', '--n-sub'], {
    nargs: '?', help: 'SUB Workers', defaultValue: 1
});
parser.addArgument(['-m', '--n-mul'], {
    nargs: '?', help: 'MUL Workers', defaultValue: 1
});
parser.addArgument(['-d', '--n-div'], {
    nargs: '?', help: 'DIV Workers', defaultValue: 1
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

    var n_add = args.n_add, iid_add = {},
        n_sub = args.n_sub, iid_sub = {},
        n_mul = args.n_mul, iid_mul = {},
        n_div = args.n_div, iid_div = {};

    for (var add_i = 0; add_i < n_add; add_i++) {
        iid_add[add_i] = setInterval((function (i, t) {
            var pair = new Space.System.Pair({
                lhs: random(0, 256), rhs: random(0, 256)
            });

            t[i] = process.hrtime();
            system_service.api.add(pair, function (error, result) {
                if (error !== null) throw error;

                assert.equal(pair.lhs + pair.rhs, result.value);
                var dt = process.hrtime(t[i]); t[i] = process.hrtime();
                console.log('dT[add]@%d:', i, dt[0]*1E3 + dt[1]/1E6);

            });
        }).with(add_i, {}), 0);
    }

    for (var sub_i = 0; sub_i < n_sub; sub_i++) {
        iid_sub[sub_i] = setInterval((function (i, t) {
            var pair = new Space.System.Pair({
                lhs: random(0, 256), rhs: random(0, 256)
            });

            t[i] = process.hrtime();
            system_service.api.sub(pair, function (error, result) {
                if (error !== null) throw error;

                assert.equal(pair.lhs - pair.rhs, result.value);
                var dt = process.hrtime(t[i]); t[i] = process.hrtime();
                console.log('dT[sub]@%d:', i, dt[0]*1E3 + dt[1]/1E6);
            });
        }).with(sub_i, {}), 0);
    }

    for (var mul_i = 0; mul_i < n_mul; mul_i++) {
        iid_mul[mul_i] = setInterval((function (i, t) {
            var pair = new Space.System.Pair({
                lhs: random(0, 256), rhs: random(0, 256)
            });

            t[i] = process.hrtime();
            system_service.api.mul(pair, function (error, result) {
                if (error !== null) throw error;

                assert.equal(pair.lhs * pair.rhs, result.value);
                var dt = process.hrtime(t[i]); t[i] = process.hrtime();
                console.log('dT[mul]@%d:', i, dt[0]*1E3 + dt[1]/1E6);
            });
        }).with(mul_i, {}), 0);
    }

    for (var div_i = 0; div_i < n_div; div_i++) {
        iid_div[div_i] = setInterval((function (i, t) {
            var pair = new Space.System.Pair({
                lhs: random(0, 256), rhs: random(0, 256)
            });

            t[i] = process.hrtime();
            system_service.api.div(pair, function (error, result) {
                if (error !== null) throw error;
                var q = pair.lhs / pair.rhs;

                assert.ok(isNaN(q) === isNaN(result.value));
                assert.ok(isFinite(q) === isFinite(result.value));
                assert.ok(isFinite(q) === false ||
                    Math.abs(q - result.value) < 1E6);

                var dt = process.hrtime(t[i]); t[i] = process.hrtime();
                console.log('dT[div]@%d:', i, dt[0]*1E3 + dt[1]/1E6);
            });
        }).with(div_i, {}), 0);
    }

    setTimeout(function () {
        for (var key_add in iid_add)
            if (iid_add.hasOwnProperty(key_add))
                clearInterval(iid_add[key_add]);
        for (var key_sub in iid_sub)
            if (iid_sub.hasOwnProperty(key_sub))
                clearInterval(iid_sub[key_sub]);
        for (var key_mul in iid_mul)
            if (iid_mul.hasOwnProperty(key_mul))
                clearInterval(iid_mul[key_mul]);
        for (var key_div in iid_div)
            if (iid_div.hasOwnProperty(key_div))
                clearInterval(iid_div[key_div]);

        system_service.socket.close();
    }, 10000);
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Function.prototype.with = function () {
    var slice = Array.prototype.slice,
        args = slice.call(arguments),
        func = this;

    return function () {
        return func.apply(this, args.concat(slice.call(arguments)));
    };
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
