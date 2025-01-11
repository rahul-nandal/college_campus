var currentLanguage = 'html';
var textarea = document.getElementById('code');
let counter = 0;
let counterHistory = [0];
let historyIndex = 0;
const counterBtn = document.getElementById('counterBtn');
const counterValue = document.getElementById('counterValue');
counterBtn.addEventListener('click', () => {
    counter++;
    counterValue.textContent = `Counter: ${counter}`;
    addToHistory(counter);
});
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'z') {
        undo();
    } else if (event.ctrlKey && event.key === 'y') {
        redo();
    }
});
function addToHistory(value) {
    counterHistory.splice(historyIndex + 1);
    counterHistory.push(value);
    historyIndex = counterHistory.length - 1;
}
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        counter = counterHistory[historyIndex];
        updateCounter();
    }
}
function redo() {
    if (historyIndex < counterHistory.length - 1) {
        historyIndex++;
        counter = counterHistory[historyIndex];
        updateCounter();
    }
}
function updateCounter() {
    counterValue.textContent = `Counter: ${counter}`;
}
function switchLanguage(language) {
    saveToFile(currentLanguage);
    currentLanguage = language;
    loadFromFile(currentLanguage);
    setPlaceholder();
}
function setPlaceholder() {
    var placeholderText = 'Enter ' + currentLanguage.toUpperCase() + ' code...';
    document.getElementById('code').placeholder = placeholderText;
}
function saveToFile(language) {
    var code = document.getElementById('code').value;
    var projectName = getPageNameFromUrl();
    if (code.trim() !== '' && projectName) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById('code').value = '';
            }
        };
        xhr.open('POST', '/save?project_name=' + encodeURIComponent(projectName), true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('language=' + language + '&code=' + encodeURIComponent(code));
    }
}
function loadFromFile(language) {
    var xhr = new XMLHttpRequest();
    var projectName = getPageNameFromUrl();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('code').value = xhr.responseText;
        }
    };
    xhr.open('GET', `/load?language=${language}&project_name=${projectName}`, true);
    xhr.send();
}
function renderCode() {
    saveToFile(currentLanguage);
    var xhr = new XMLHttpRequest();
    var projectName = getPageNameFromUrl();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var newTab = window.open();
            newTab.document.open();
            newTab.document.write(xhr.responseText);
            newTab.document.close();
        }
    };
    xhr.open('GET', `/render?project_name=${projectName}`, true);
    xhr.send();
    loadFromFile(currentLanguage);
    setPlaceholder();
}
document.getElementById('code').addEventListener('input', function () {
    var code = this.value.trim();
    if (code === '') {
        setPlaceholder();
    } else {
        this.placeholder = '';
    }
});
function addPage(){
    window.location.href='/ide/add_page';
}
function openPage(){
    window.location.href='/ide/open_page';
}
function openAssets(){
    window.location.href='/ide/assets';
}
function getPageNameFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('project_name');
}
function callchatgpt(){
    saveToFile(currentLanguage);
    showPrompt();
}
function showPrompt() {
    var popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
    var label = document.createElement('label');
    label.textContent = 'Enter your instruction:';
    popupContainer.appendChild(label);
    var textarea = document.createElement('textarea');
    textarea.classList.add('popup-textarea');
    textarea.setAttribute('rows', '5'); 
    textarea.setAttribute('cols', '30'); 
    popupContainer.appendChild(textarea);
    var submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.classList.add('popup-submit-button');
    submitButton.addEventListener('click', function() {
        var userInput = textarea.value;
        handleUserInput(userInput);
        document.body.removeChild(popupContainer);
    });
    popupContainer.appendChild(submitButton);
    document.body.appendChild(popupContainer);
}
function handleUserInput(input) {
    var data = {
        userInput: input
    };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/call_chatgpt', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Response from server:', xhr.responseText);
            } else {
                console.error('Error:', xhr.status, xhr.statusText);
            }
        }
    };
    xhr.send(JSON.stringify(data));
}
loadFromFile(currentLanguage);
setPlaceholder();