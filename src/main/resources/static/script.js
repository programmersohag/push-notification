$(document).ready(function () {
    connect();
    $("#send-global-msg").click(function () {
        sendGlobalMessage();
    });

    $("#send-private-msg").click(function () {
        sendPrivateMessage();
    });

    $("#notifications-icon").click(function () {
        //resetNotificationCount();
    });
});
let stompClient = null;
let notificationCount = 0;

function connect() {
    const socket = new SockJS('/our-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('==========Frame=============');
        console.log(frame);
        updateNotificationDisplay();
        stompClient.subscribe('/topic/global-messages', function (message) {
            showMessage(JSON.parse(message.body).content);
        });

        stompClient.subscribe('/user/topic/private-messages', function (message) {
            showMessage(JSON.parse(message.body).content);
        });

        stompClient.subscribe('/topic/global-notifications', function (message) {
            console.log(message);
            notificationCount = notificationCount + 1;
            updateNotificationDisplay();
        });

        stompClient.subscribe('/user/topic/private-notifications', function (message) {
            console.log(message);
            notificationCount = notificationCount + 1;
            updateNotificationDisplay();
        });
    });
}

function sendGlobalMessage() {
    console.log("sending message");
    stompClient.send("/ws/global-message", {}, JSON.stringify({'messageContent': $("#global-message").val()}));
}

function sendPrivateMessage() {
    console.log("sending private message");
    stompClient.send("/ws/private-message", {}, JSON.stringify({'messageContent': $("#private-message").val()}));
}

function showMessage(message) {
    $("#messages").append("<tr><td>" + message + "</td></tr>");
}

function updateNotificationDisplay() {
    const notificationEl = $('#notifications-icon');
    if (notificationCount === 0) {
        notificationEl.hide();
    } else {
        notificationEl.show();
        notificationEl.text(notificationCount);
    }
}
