const chatFrame = document.getElementById('chatFrame');
let userScrolledManually = false; 
document.addEventListener('DOMContentLoaded', function() {
    getUsernameFromServer();
    startMessageFetchingScheduler();
    loadChat();
});
function getUsernameFromServer() {
    fetch('/get_username')
    .then(response => response.json())
    .then(data => {
        console.log('Received data from server:', data);
        const username = data.username;
        if (username) {
            console.log('Username received from server:', username);
            document.getElementById('usernameInput').value = username;
            localStorage.setItem('username', username)
        } else {
            console.log('No username received from server');
            const storedUsername = localStorage.getItem('username');
            if (storedUsername) {
                console.log('Using stored username:', storedUsername);
                document.getElementById('usernameInput').value = storedUsername;
            } else {
                console.log('No stored username found');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function changeUsername(){
    const newUsername = document.getElementById('usernameInput').value;
    localStorage.setItem('username', newUsername);
    fetch('/change_username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `new_username=${newUsername}`
    })
}
function scrollToBottom() {
    const chatFrame = document.getElementById('chatFrame');
    chatFrame.scrollTop = chatFrame.scrollHeight;
}
function fetchMessagesFromServer() {
    fetch('/chat/receive')
        .then(response => response.json())
        .then(data => {
            const chatFrame = document.getElementById('chatFrame');
            const wasAtBottom = chatFrame.scrollTop + chatFrame.clientHeight >= chatFrame.scrollHeight - 20;
            data.messages.forEach(message => {
                appendMessageToChatFrame(message.trim());
            });
            if (wasAtBottom || !userScrolledManually) {
                scrollToBottom();
            }
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
        });
}
function loadChat() {
    fetch('/chat/load_chat')
        .then(response => response.json())
        .then(data => {
            const chatFrame = document.getElementById('chatFrame');
            const wasAtBottom = chatFrame.scrollTop + chatFrame.clientHeight >= chatFrame.scrollHeight - 20;
            chatFrame.innerHTML = '';
            data.messages.forEach(message => {
                appendMessageToChatFrame(message.trim());
            });
            if (wasAtBottom || !userScrolledManually) {
                scrollToBottom();
            }
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
        });
}
function appendMessageToChatFrame(message) {
    const chatFrame = document.getElementById('chatFrame');
    const messageContainer = document.createElement('div');
    messageContainer.className = 'messageContainer';
    const messageBubble = document.createElement('div');
    messageBubble.className = 'messageBubble';
    const match = message.match(/^\d+\.\d+\.\d+\.\d+ \(([^)]+)\): (.+)$/);
    if (match && match.length === 3) {
        const username = match[1];
        const content = match[2];
        messageBubble.innerText = `${username}: ${content}`;
    } else {
        messageBubble.innerText = message;
    }
    messageContainer.appendChild(messageBubble);
    chatFrame.appendChild(messageContainer);
}
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim(); 
    const username = document.getElementById('usernameInput').value;
    if (message !== '') {
        fetch('/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `message=${encodeURIComponent(message)}&username=${encodeURIComponent(username)}`
        })
        .then(() => {
            messageInput.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}
document.getElementById('messageInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage(); 
    }
});
function startMessageFetchingScheduler() {
    setInterval(() => {
        fetchMessagesFromServer();
    }, 1000); 
}
if (chatFrame) {
    chatFrame.addEventListener('scroll', function() {
        userScrolledManually = chatFrame.scrollTop + chatFrame.clientHeight < chatFrame.scrollHeight;
    });
} else {
    console.error('Element with ID "chatFrame" not found.');
}