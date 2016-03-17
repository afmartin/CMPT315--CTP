.PHONY: test

development: packages
	NODE_ENV=development npm start

production: packages
	NODE_ENV=production npm start

test: packages
	NODE_ENV=test ./node_modules/.bin/mocha -u tdd

packages: package.json
	npm install
