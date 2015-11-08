.PHONY: run-py run-py.cpy3 run-py.ppy3
.PHONY: clean-py

###############################################################################
###############################################################################

build: \
	build-py
build-py: \
	build-py.cpy3 build-py.ppy3
build-py.cpy3:
	cd py && rm cpy3 -rf && mkdir -p cpy3
	cd py && virtualenv3 -p /usr/bin/python3 --prompt="[cpy3] " cpy3/
	cd py && cpy3/bin/python setup.py install
build-py.ppy3:
	cd py && rm ppy3 -rf && mkdir -p ppy3
	cd py && virtualenv3 -p /usr/bin/pypy3 --prompt="[ppy3] " ppy3/
	cd py && ppy3/bin/python setup.py install

###############################################################################
###############################################################################

run:
	py/cpy3/bin/python py/server.py $(filter-out $@,$(MAKECMDGOALS))
run-py:
	py/cpy3/bin/python py/server.py $(filter-out $@,$(MAKECMDGOALS))
run-py.cpy3:
	py/cpy3/bin/python py/server.py $(filter-out $@,$(MAKECMDGOALS))
run-py.ppy3:
	py/ppy3/bin/python py/server.py $(filter-out $@,$(MAKECMDGOALS))

###############################################################################
###############################################################################

clean: \
	clean-py
clean-py:
	rm py/{build,dist} -rf
	rm py/{cpy3,ppy3} -rf
	rm py/*.egg-info -rf

###############################################################################
###############################################################################
