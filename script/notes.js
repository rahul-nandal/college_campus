document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("file-upload");
    const fileCountSpan = document.getElementById("file-count");
    fileInput.addEventListener("change", function() {
        if (fileInput.files && fileInput.files.length > 0) {
            fileCountSpan.textContent = fileInput.files.length + " file(s) selected";
        } else {
            fileCountSpan.textContent = "No files selected";
        }
    });
});