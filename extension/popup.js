document.getElementById('askButton').addEventListener('click', function() {
    var userQuestion = document.getElementById('question').value; // Match the ID from your HTML
    if (userQuestion.trim() === '') {
        alert('Please type a question.');
        return;
    }

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'API_KEY' // REPLACE THIS WITH THE REAL API KEY
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "You are ChatGPT, a helpful assistant."
            }, {
                role: "user",
                content: userQuestion // Dynamically insert the user's question here
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
