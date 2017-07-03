/* jshint ignore:start */
var wsUri = 'ws://echo.websocket.org/',
    output, websocket;

function init() {
    // output = document.getElementById('output');
    testWebSocket();
}

function testWebSocket() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
        onOpen(evt);
    };
    websocket.onclose = function(evt) {
        onClose(evt);
    };
    websocket.onmessage = function(evt) {
        onMessage(evt);
    };
    websocket.onerror = function(evt) {
        onError(evt);
    };
}

function onOpen(evt) {
    console.log(evt);
    writeToScreen('CONNECTED');
    // doSend('WebSocket rocks');
}

function onClose(evt) {
    console.log(evt);
    writeToScreen('DISCONNECTED');
}

function onMessage(evt) {
    console.log(evt);
    // writeToScreen('<span style=\'color: blue;\'>RESPONSE: ' + evt.data + '</span>');
    websocket.close();
}

function onError(evt) {
    console.log(evt);
    // writeToScreen('<span style=\'color: red;\'>ERROR:</span> ' + evt.data);
}

function doSend(message) {
    writeToScreen('SENT: ' + message);
    waitForConnection(function() {
        websocket.send(message);
    }, 1000);
}

function waitForConnection(callback, interval) {
    if (websocket.readyState === 1) {
        callback();
    } else {
        var vm = this;
        // optional: implement backoff for interval here
        setTimeout(function() {
            vm.waitForConnection(callback, interval);
        }, interval);
    }
};

function writeToScreen(message) {
    // var pre = document.createElement('p');
    // pre.style.wordWrap = 'break-word';
    // pre.innerHTML = message;
    // output.appendChild(pre);
    console.log(message);
}

// window.addEventListener('load', init, false);
/* jshint ignore:end */
