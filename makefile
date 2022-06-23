NAME=retro-rusty-game
CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
APP_DIR=./app
SERVER_DIR=./server
APP_NAME=$(NAME)-app
SERVER_NAME=$(NAME)-server

clean: 
	docker rm -f $(APP_NAME)
	docker rm -f $(SERVER_NAME)

build: clean
	docker build --no-cache --tag $(APP_NAME) 		$(APP_DIR)
	docker build --no-cache --tag $(SERVER_NAME) 	$(SERVER_DIR)

run: build
	docker run --detach --publish 8080:8080 --name $(APP_NAME) 		$(APP_NAME)
	docker run --detach --publish 3000:3000 --name $(SERVER_NAME) 	$(SERVER_NAME)

	$(CHROME) --auto-open-devtools-for-tabs  http://localhost:8080
	$(CHROME) --auto-open-devtools-for-tabs  http://localhost:8080

open: 
	$(CHROME) --auto-open-devtools-for-tabs  http://localhost:8080
	$(CHROME) --auto-open-devtools-for-tabs  http://localhost:8080

