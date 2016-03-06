.PHONY: dev

dev: modules migrate seed 
	npm start

seed:
	echo "Seeding to be implemented"

migrate: migrations/*
	node_modules/.bin/sequelize db:migrate

modules: package.json
	npm install

