.PHONY: run-py run-py.env
.PHONY: clean-py

###############################################################################
###############################################################################

build: \
	build-js build-py
build-js:
	cd js && npm install
build-py: build-py.pb
	cd py && rm env -rf && mkdir -p env
	cd py && virtualenv2 -p /usr/bin/python2 --system-site-packages env/
	cd py && env/bin/python setup.py install
build-py.pb:
	cd py && protoc --python_out=./ protocol/*.proto

###############################################################################
###############################################################################

run:\
	run-js
run-js:
	cd js && ./bin/rpc-server $(filter-out $@,$(MAKECMDGOALS))
run-py:
	py/env/bin/python py/server.py $(filter-out $@,$(MAKECMDGOALS))

###############################################################################
###############################################################################

clean: \
	clean-js clean-py
clean-js:
	rm js/node_modules -rf
clean-py:
	rm py/{build,dist,env} -rf
	rm py/*.egg-info -rf
	rm py/protocol/*_pb2.py -f
	rm py/protocol/*_pb3.py -f

###############################################################################
###############################################################################
