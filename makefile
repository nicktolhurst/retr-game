NAME=retro-rusty-game
CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
FE_DIR=fe
WS_DIR=ws

run-fe: 
	npx live-server --mount=/:./fe/

run-ws: 
	npx nodemon ./ws/server.js

publish-fe:
	git push --force fe main

publish-ws:
	git push --force ws main

publish: publish-fe publish-ws

open:
	heroku open -a retr-fe