#!/usr/bin/env bash

mkdir -p cpy3
mkdir -p ppy3

virtualenv3 -p /usr/bin/python3 --prompt="[cpy3] " cpy3/
virtualenv3 -p /usr/bin/pypy3 --prompt="[ppy3] " ppy3/

cpy3/bin/pip3 install tornado
ppy3/bin/pip3 install tornado

