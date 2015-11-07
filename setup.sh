#!/usr/bin/env bash

rm -r cpy3
mkdir cpy3

virtualenv3 -p /usr/bin/python3 --prompt="[cpy3] " cpy3/
cpy3/bin/pip3 install tornado

rm -r ppy3
mkdir ppy3

virtualenv3 -p /usr/bin/pypy3 --prompt="[ppy3] " ppy3/
ppy3/bin/pip3 install tornado
