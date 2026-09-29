import { useMemo, useRef, useState } from 'react'
import './App.css'
import { askAI } from './ai'

const starterMessages = [
  
]

const historyItems = ['New chat', 'Website ideas', 'Study helper', 'Product strategy']

function App() {
  const textAreaRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi! I am Olam AI. Ask me anything and I will help with ideas, coding, business, or general questions.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedChat, setSelectedChat] = useState('New chat')
  const [isDarkMode, setIsDarkMode] = useState(true)

  const quickPrompts = useMemo(() => starterMessages, [])

  const autoResizeTextArea = (value) => {
    const textarea = textAreaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`

    if (value === '') {
      textarea.style.height = '52px'
    }
  }

  const startNewChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: 'Hi! I am Olam AI. Ask me anything and I will help with ideas, coding, business, or general questions.',
      },
    ])
    setInput('')
    setSelectedChat('New chat')
    autoResizeTextArea('')
  }

  const loadChat = (chatName) => {
    setSelectedChat(chatName)
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: `Welcome to "${chatName}" chat. What would you like to discuss?`,
      },
    ])
    setInput('')
    autoResizeTextArea('')
  }

  const sendMessage = async (messageText) => {
    const cleanText = messageText.trim()
    if (!cleanText || isLoading) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: cleanText,
    }

    setMessages((current) => [...current, userMessage])
    setInput('')
    autoResizeTextArea('')
    setIsLoading(true)

    const botReply = await askAI(cleanText)

    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: botReply,
    }

    setMessages((current) => [...current, botMessage])
    setIsLoading(false)
  }

  return (
    <div className={`chatgpt-shell ${isDarkMode ? 'dark' : 'light'}`}>
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">O</div>
          <span>Olam AI</span>
        </div>

        <button 
          type="button" 
          className="new-chat-btn"
          onClick={startNewChat}
        >
          + New chat
        </button>

        <nav className="history-nav" aria-label="Chat history">
          {historyItems.map((item) => (
            <button 
              key={item} 
              type="button" 
              className={`history-item ${selectedChat === item ? 'active' : ''}`}
              onClick={() => item === 'New chat' ? startNewChat() : loadChat(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="profile-card">
          <div className="avatar">H</div>
          <div>
            <strong>Guest User</strong>
            <small>Free plan</small>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="chat-header">
          <div className="header-left">
            <span className="chip">GPT-4o mini</span>
          </div>
          <div className="header-actions">
            <button type="button" onClick={() => setIsDarkMode(!isDarkMode)} className="theme-toggle" title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDarkMode ? '🌙' : '☀️'}
            </button>
            <button type="button">Share</button>
            <button type="button" onClick={startNewChat}>Clear</button>
          </div>
        </header>

        <section className="messages" aria-live="polite">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`message-row ${message.sender === 'user' ? 'user' : 'bot'}`}
            >
              <div className="message-avatar">
                {message.sender === 'user' ? 'U' : 'AI'}
              </div>
              <div className="bubble">{message.text}</div>
            </article>
          ))}

          {isLoading && (
            <article className="message-row bot">
              <div className="message-avatar">AI</div>
              <div className="bubble typing">Thinking...</div>
            </article>
          )}
        </section>

        <div className="quick-prompts">
          {quickPrompts.map((prompt) => (
            <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault()
            sendMessage(input)
          }}
        >
          <textarea
            ref={textAreaRef}
            rows="1"
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              autoResizeTextArea(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendMessage(input)
              }
            }}
            placeholder="Message Olam AI..."
            aria-label="Message Olam AI"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} aria-label="Send message">
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default App
