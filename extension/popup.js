// Description: This script handles the behavior of the main extension window.
document.addEventListener('DOMContentLoaded', function() {
    var askButton = document.getElementById('askButton');
    var questionInput = document.getElementById('question');

    // Allow pressing Enter to submit the question
    questionInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            askButton.click();
        }
    });
    // Allow clicking behavior for the button to submit the question
    document.getElementById('setApiKeyButton').addEventListener('click', function() {
        chrome.windows.create({url: 'setup.html', type: 'popup', width: 500, height: 600});
    });

    document.getElementById('askButton').addEventListener('click', function() {
        // Get the user's question
        var userQuestion = document.getElementById('question').value;
        if (userQuestion.trim() === '') {
            alert('Please type a question.');
            return;
        }
        chrome.storage.local.get(['apiKey'], function(result) {
            const apiKey = result.apiKey;
            // Check if the API key is set
            if (!apiKey) {
                alert('API key not found. Please set it up.');
                return;
            }

            // Make a request to the ChatGPT API
            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4-turbo", // Change this to the version of GPT you want
                    messages: [{
                        role: "system",
                        content: "You are ChatGPT, a helpful assistant."
                    }, {
                        role: "user",
                        content: userQuestion
                    }]
                })
            })
                .then(response => response.json())
                .then(data => {
                    // Display the response
                    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                        document.getElementById('response').textContent = data.choices[0].message.content;
                    // Handle API errors
                    } else if (data.error) {
                        console.error('API Error:', data.error);
                        document.getElementById('response').textContent = `API Error: ${data.error.message}`;
                    } else {
                        console.error('Unexpected response structure:', data);
                        document.getElementById('response').textContent = 'No response from API or unexpected structure.';
                    }
                })
                // Handle network errors
                .catch((error) => {
                    console.error('Error:', error);
                    document.getElementById('response').textContent = 'Failed to fetch response from API.';
                });
        });
    });
});