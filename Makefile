TESTS = $(shell find test/*.test.js)

test:
	@NODE_ENV=test expresso \
	-I lib \
	$(TESTFLAGS) \
	$(TESTS)

test-cov:
	@TESTFLAGS=--cov $(MAKE) test

.PHONY: test
