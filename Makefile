.PHONY: test

development: packages test
	NODE_ENV=development npm start

production: packages test
	NODE_ENV=production npm start

test: packages
	NODE_ENV=test ./node_modules/.bin/mocha -u tdd

packages: package.json
	npm install
