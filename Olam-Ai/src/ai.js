export function formatPlainText(rawText = '') {
  if (!rawText) return '';

  return rawText
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/#{1,6}\s*/g, '')
    .replace(/^-\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
export async function askAI(question) {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return 'Please type a question so I can help you.';
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma4:31b',
        messages: [
          {
            role: 'user',
            content: trimmedQuestion,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.message?.content?.trim() || data?.response?.trim();

    if (text) {
      return formatPlainText(text);
    }

    return 'Unable to generate a response. Please try again.';
  } catch (error) {
    console.error('API request failed:', error);
    return formatPlainText(`Error: ${error.message || 'Failed to get response from AI'}`);
  }
}
