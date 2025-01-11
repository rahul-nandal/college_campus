document.getElementById('username').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('usernameForm').submit(); 
    }
});