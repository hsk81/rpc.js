.PHONY: run-py run-py.cpy run-py.ppy
.PHONY: clean-py

###############################################################################
###############################################################################

build: \
	build-js build-py
build-js:
	cd js && npm install
build-py: \
	build-py.cpy build-py.ppy
build-py.cpy: build-py.pb
	cd py && rm cpy -rf && mkdir -p cpy
	cd py && virtualenv2 -p /usr/bin/python2 --prompt="[cpy] " cpy/
	cd py && cpy/bin/python setup.py install
build-py.ppy: build-py.pb
	cd py && rm ppy -rf && mkdir -p ppy
	cd py && virtualenv2 -p /usr/bin/pypy --prompt="[ppy] " ppy/
	cd py && ppy/bin/python setup.py install
build-py.pb:
	cd py && protoc --python_out=./ protocol/*.proto

###############################################################################
###############################################################################

run:\
	run-js
run-js:
	cd js && ./bin/rpc-server $(filter-out $@,$(MAKECMDGOALS))
run-py:
	py/cpy/bin/python py/server.py $(filter-out $@,$(MAKECMDGOALS))
run-py.cpy:
	py/cpy/bin/python py/server.py $(filter-out $@,$(MAKECMDGOALS))
run-py.ppy:
	py/ppy/bin/python py/server.py $(filter-out $@,$(MAKECMDGOALS))

###############################################################################
###############################################################################

clean: \
	clean-js clean-py
clean-js:
	rm js/node_modules -rf
clean-py:
	rm py/{build,dist} -rf
	rm py/{cpy,ppy} -rf
	rm py/*.egg-info -rf
	rm py/protocol/*.py -f

###############################################################################
###############################################################################
