#!/usr/bin/env python
###############################################################################

import tornado.web
import tornado.websocket
import tornado.ioloop

###############################################################################
###############################################################################

class WsEchoHandler (tornado.websocket.WebSocketHandler):

    def open (self):
        self.write_message("You are connected")

    def on_message (self, message):
        self.write_message(message)

    def on_close (self):
        pass

    def check_origin (self, origin):
        return True

###############################################################################

application = tornado.web.Application ([
    (r'/', WsEchoHandler),
])

###############################################################################
###############################################################################

if __name__ == "__main__":

    application.listen (8888)
    tornado.ioloop.IOLoop.instance ().start ()

###############################################################################
###############################################################################
