var isScrolling;
window.addEventListener('scroll', function() {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(function() {
        var scrollPosition = window.scrollY;
        var viewportHeight = window.innerHeight;
        var sectionIndex = Math.round(scrollPosition / viewportHeight);
        var targetScroll = sectionIndex * viewportHeight;
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    }, 200); 
});
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


document.addEventListener('DOMContentLoaded', function() {
    getUsernameFromServer();
    getEmailFromServer();
});
function getUsernameFromServer() {
    fetch('/get_username')
    .then(response1 => response1.json())
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
function logout(){
    fetch('/logout')
}
function getEmailFromServer() {
    fetch('/get_email')
    .then(response => response.json())
    .then(data => {
        console.log('Received data from server:', data);
        const email = data.email;
        if (email) {
            console.log('Email received from server:', email);
            document.getElementById('emailInput').value = email; // Assuming an input field with id='emailInput'
            localStorage.setItem('email', email);
        } else {
            console.log('No email received from server');
            const storedEmail = localStorage.getItem('email');
            if (storedEmail) {
                console.log('Using stored email:', storedEmail);
                document.getElementById('emailInput').value = storedEmail;
            } else {
                console.log('No stored email found');
            }
        }
    })
    .catch(error => {
        console.error('Error fetching email:', error);
    });
}
