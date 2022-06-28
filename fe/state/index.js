let socket = io(new URL((window.location.href)).hostname == 'retr-fe.herokuapp.com' ? 'https://retr-ws.herokuapp.com/' : 'http://localhost:3000');

socket.on('gameState', handleGameState);
socket.on('init', handleInit);

const state = document.getElementById('state');
const stateScreen = document.getElementById('stateScreen');
const initialScreen = document.getElementById('initialScreen');
const getStateButton = document.getElementById('getStateButton');
const gameCodeInput = document.getElementById('gameCodeInput');

getStateButton.addEventListener('click', handleGetStateButton);

let code, ready = false;

function handleGameState(gameState) {

    if (!ready) { return; }
    state.innerText = JSON.stringify(JSON.parse(gameState), undefined, 2)
}

function handleGetStateButton() {

    code = gameCodeInput.value;

    socket.emit("getStateFor", code);

}

function handleInit() {

    initialScreen.style.display = "none";
    stateScreen.style.display = "block";

    ready = true;

}