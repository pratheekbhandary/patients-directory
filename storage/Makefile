PROJECT=patients-directory

up:
	docker-compose -p ${PROJECT} up -d

down:
	docker-compose -p ${PROJECT} down -v --remove-orphans
	rm -rf .data
