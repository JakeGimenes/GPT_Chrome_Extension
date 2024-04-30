// Description: This file is used to change the API key popup from the popup.html file.
document.getElementById('setupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const apiKey = document.getElementById('apiKey').value;
    // Save the API key to local storage, no more json file, yay!
    chrome.storage.local.set({apiKey: apiKey}, function() {
        alert('API key saved.');
        // Close the window after saving the API key
        window.close();
    });
});