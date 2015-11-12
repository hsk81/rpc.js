#!/usr/bin/env python
###############################################################################

import argparse, os
import tornado.web
import tornado.websocket
import tornado.ioloop

###############################################################################
###############################################################################

from protocol import dizmo_space_pb2 as Dizmo

###############################################################################
###############################################################################

class WebSocketHandler (tornado.websocket.WebSocketHandler):

    def on_message (self, data):
        rpc_req = Dizmo.Rpc.Request()
        rpc_req.ParseFromString(data)
        pair = Dizmo.System.Pair()
        pair.ParseFromString(rpc_req.data)

        if rpc_req.name == '.SystemService.add':
            result = Dizmo.System.AddResult()
            result.value = pair.lhs + pair.rhs

        elif rpc_req.name == '.SystemService.sub':
            result = Dizmo.System.SubResult()
            result.value = pair.lhs - pair.rhs

        elif rpc_req.name == '.SystemService.mul':
            result = Dizmo.System.MulResult()
            result.value = pair.lhs * pair.rhs

        elif rpc_req.name == '.SystemService.div':
            result = Dizmo.System.DivResult()
            result.value = pair.lhs / pair.rhs

        else:
            raise Exception('{0}: not suported'.format(rpc_req.name))

        rpc_res = Dizmo.Rpc.Response()
        rpc_res.id = rpc_req.id
        rpc_req.data = result.SerializeToString()

        self.write_message(rpc_req.SerializeToString(), binary=True)

    def check_origin (self, origin):
        return True

###############################################################################

application = tornado.web.Application ([(r'/', WebSocketHandler)])

###############################################################################
###############################################################################

if __name__ == "__main__":

    parser = argparse.ArgumentParser (prog='RPC Server',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument('-v', '--version', action='version',
        version='%(prog)s 0.0.1')
    parser.add_argument ('port', metavar='PORT', type=int,
        default=os.environ.get ('RPC_PORT', 8088), nargs='?',
        help='Server Port')
    parser.add_argument ('host', metavar='HOST', type=str,
        default=os.environ.get ('RPC_HOST', 'localhost'), nargs='?',
        help='Server Host')

    args = parser.parse_args ()
    application.listen (args.port, args.host)
    tornado.ioloop.IOLoop.instance ().start ()

###############################################################################
###############################################################################
