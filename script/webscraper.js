function scrapeWebpage() {
    var urlInput = document.getElementById("urlInput").value;
    var resultDiv = document.getElementById("result");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            resultDiv.innerHTML = xhr.responseText;
        }
    };
    xhr.open("POST", "/scrape", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("url=" + encodeURIComponent(urlInput));
    window.location.href="/webscraper/history"
}