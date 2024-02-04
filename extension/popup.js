document.getElementById('askButton').addEventListener('click', function() {
  var question = document.getElementById('question').value;
  if(question.trim() === '') {
    alert('Please type a question.');
    return;
  }

  var data = {
    prompt: question,
    temperature: 0.5,
    max_tokens: 100,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };

  fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY_HERE'
    },
    body: JSON.stringify(data)
  })
      .then(response => response.json())
      .then(data => {
        document.getElementById('response').textContent = data.choices[0].text;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
});
