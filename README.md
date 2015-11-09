# RPC.js - An RPC solution for JavaScript

[Node.js]: http://nodejs.org/
[ws]: https://www.npmjs.com/package/ws
[WebSockets]: http://www.html5rocks.com/en/tutorials/websockets/basics/
[Python]: https://www.python.org/
[Tornado]: http://www.tornadoweb.org/en/stable/

[matplotlib]: http://matplotlib.org/
[PyPy]: http://pypy.org/

A research onto the behaviour of a lightweight RPC approach for JavaScript: The
system is made of two components - a client and a server - with the following
setup:

    [client: node.js] <=> [protocol: web-sockets] <=> [server: python]

## Client: Node.js with ws

The client is an implementation in [Node.js] using the fast [ws] library for
[WebSockets]: It sends a short message (a single dot character) to the server.
Since the server reflects the message, the same message is immediately received
back:

    [client: message] => [server: echo] => [client: same message]

The durations between each reception of a message is measured with a resolution
of milli-seconds, and they are then reported continuously on the console.
 
## Protocol: WebSockets 

The [WebSockets] protocol is used for communication, where the client connects
to e.g. `ws://localhost:8088` and where the server listens accordingly on the
port `8088`.

Using this example, the client-server system ends up being an experiment to
measure the performance capacity of WebSockets on a local system.

## Server: Python with Tornado

Upon receiving a message the server reflects it immediately back as it is,
without any further processing. It has been implemented using [Python] with
[Tornado] - a web framework and asynchronous networking library.

## Building the client/server

To build the server execute:

    make build-server

And to build the client run:

    make build-client

## Running the client/server

To run the server execute:

    make run-server py

To run the client execute:

    make run-client py

## Performance

To analyse the time measurements done by client the console output needs to be
captured into a file:

    make run-client py | grep ^0 > log/statistics.log

Then a corresponding histogram can be generated with:

    cat log/statistics | ./server/py/plot.py histogram

For the latter to work you need the [matplotlib] to be available with your
Python 3 installation: An image like `img-[0000-00-00T00:00:00.000Z].png` should
be generated.

On a GNU/Linux system with a Intel Pentium CORE i5 processor you should get an
image like:

![RTT in milli-seconds](log/img-[2015-11-09T10:41:10.658Z].png)

As you see the average RTT is about 1.33ms with a standard deviation of 0.65ms.
To gauge the robustness of the system depending on various parts of the test,
the server has been run using a standard CPython version 3.5 implementation,
but it has also be run using [PyPy] 2.4, which produced similar results.