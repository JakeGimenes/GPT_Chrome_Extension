document.addEventListener('DOMContentLoaded', function() {
    var askButton = document.getElementById('askButton');
    var questionInput = document.getElementById('question');

    questionInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            askButton.click();
        }
    });

    document.getElementById('setApiKeyButton').addEventListener('click', function() {
        chrome.windows.create({url: 'setup.html', type: 'popup', width: 500, height: 600});
    });

    document.getElementById('askButton').addEventListener('click', function() {
        var userQuestion = document.getElementById('question').value;
        if (userQuestion.trim() === '') {
            alert('Please type a question.');
            return;
        }

        chrome.storage.local.get(['apiKey'], function(result) {
            const apiKey = result.apiKey;
            if (!apiKey) {
                alert('API key not found. Please set it up.');
                return;
            }

            // API key stuff
            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
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
                    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                        document.getElementById('response').textContent = data.choices[0].message.content;
                    } else if (data.error) {
                        console.error('API Error:', data.error);
                        document.getElementById('response').textContent = `API Error: ${data.error.message}`;
                    } else {
                        console.error('Unexpected response structure:', data);
                        document.getElementById('response').textContent = 'No response from API or unexpected structure.';
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    document.getElementById('response').textContent = 'Failed to fetch response from API.';
                });
        });
    });
});