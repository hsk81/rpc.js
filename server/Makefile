.PHONY: run-py run-py.env
.PHONY: clean-py

###############################################################################
###############################################################################

build: \
	build-js build-py
build-js:
	cd js && npm install
build-py:
	cd py && rm env -rf && mkdir -p env
	cd py && virtualenv2 -p /usr/bin/python2 --prompt="[env] " env/
	cd py && env/bin/python setup.py install

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
	rm py/protocol/*.py -f

###############################################################################
###############################################################################
