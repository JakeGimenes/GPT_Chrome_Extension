document.getElementById('setupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.local.set({apiKey: apiKey}, function() {
        alert('API key saved.');

        window.close();
    });
});