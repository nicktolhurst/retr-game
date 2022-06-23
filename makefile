NAME=retro-rusty-game
CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
FE_DIR=fe
WS_DIR=ws

run-fe:

run-ws: 




publish-fe:
	git subtree push --prefix $(FE_DIR) heroku-fe main || true

publish-ws:
	git subtree push --prefix $(WS_DIR) heroku-ws main || true