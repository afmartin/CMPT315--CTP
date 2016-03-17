.PHONY: test

test:
	NODE_ENV=test ./node_modules/.bin/mocha -u tdd
