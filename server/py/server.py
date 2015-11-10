#!/usr/bin/env python
###############################################################################

import argparse, os
import tornado.web
import tornado.websocket
import tornado.ioloop

###############################################################################
###############################################################################

class WsEchoHandler (tornado.websocket.WebSocketHandler):

    def on_message (self, message):
        self.write_message(message, binary=True)

    def check_origin (self, origin):
        return True

###############################################################################

application = tornado.web.Application ([(r'/', WsEchoHandler)])

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
