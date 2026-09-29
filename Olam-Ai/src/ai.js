export async function askAI(question) {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return 'Please type a question so I can help you.';
  }

  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: trimmedQuestion,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.response?.trim();

    if (text) {
      return text;
    }

    return 'Unable to generate a response. Please try again.';
  } catch (error) {
    console.error('API request failed:', error);
    return `Error: ${error.message || 'Failed to get response from AI'}`;
  }
}
