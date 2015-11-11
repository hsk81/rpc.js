///////////////////////////////////////////////////////////////////////////////

var ProtoBuf = require('protobufjs'),
    WebSocket = require('ws');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var CoreFactory = ProtoBuf.loadProtoFile({
    root: __dirname + '/../../../protocol', file: 'core.proto'
});

var Core = CoreFactory.build();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var Service = mine(function (self, url, service_cls, result_cls) {
    self._handler = {};

    self.socket = new WebSocket(url);
    self.socket.on('message', function (data) {
        var service_res = Core.Service.Response.decode(data);
        self._handler[service_res.id](service_res.data);
    });

    var nextId = function () {
        function next(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        return next(0, (1 << 16) * (1 << 16));
    };

    self.api = new service_cls(function (method, req, callback) {
        var service_req = new Core.Service.Request({
            name: method, id: nextId(), data: req.toBuffer()
        });

        self._handler[service_req.id] = function (data) {
            callback(null, result_cls[method].decode(data));
        };

        self.socket.send(service_req.toBuffer(), function (error) {
            if (error) {
                delete self._handler[service_req.id];
                callback(error, null);
            }
        });
    });
});

///////////////////////////////////////////////////////////////////////////////

function mine (fn) {
    return function () {
        return fn.apply(this, [this].concat(Array.prototype.slice.call(
            arguments
        )));
    };
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

exports.Core = Core;
exports.Service = Service;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
