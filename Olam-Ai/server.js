import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const OLLAMA_API_KEY = process.env.VITE_OLLAMA_API_KEY || '103978f0e998480d8c072fd3c0b6176b.BvmU0Pi3EhGZEShOv2QFyQIk';
const OLLAMA_ENDPOINT = process.env.VITE_OLLAMA_ENDPOINT || 'https://ollama.com/api/chat';

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch(OLLAMA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OLLAMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma4:31b',
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.message?.content?.trim();

    if (text) {
      return res.json({ response: text });
    }

    res.json({ response: 'Unable to generate a response. Please try again.' });
  } catch (error) {
    console.error('Ollama API request failed:', error);
    res.status(500).json({ error: error.message || 'Failed to get response from AI' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
