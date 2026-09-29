import { useMemo, useRef, useState } from 'react'
import './App.css'
import { askAI } from './ai'

const starterMessages = [
  
]

const historyItems = ['New chat', 'Website ideas', 'Study helper', 'Product strategy']

function App() {
  const textAreaRef = useRef(null)
  const [showHome, setShowHome] = useState(true)
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
    setShowHome(false)
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
      {showHome ? (
        <div className="landing-page">
          <div className="floating-orb orb-one" />
          <div className="floating-orb orb-two" />
          <div className="floating-orb orb-three" />

          <div className="landing-card">
            <div className="landing-topbar">
              <div className="landing-badge">AI companion</div>
              <button type="button" className="theme-mini" onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? 'Light' : 'Dark'}
              </button>
            </div>

            <div className="landing-brand">
              <div className="brand-mark">O</div>
              <span>Olam AI</span>
            </div>

            <div className="landing-grid">
              <div className="landing-copy">
                <h1>Build smarter, move faster, think clearer.</h1>
                <p>
                  Olam AI helps with product strategy, website ideas, coding, study support, and business decisions — all in one focused workspace.
                </p>

                <div className="landing-actions">
                  <button type="button" className="primary-cta" onClick={startNewChat}>
                    Start chat
                  </button>
                  <button type="button" className="secondary-cta" onClick={() => setIsDarkMode(!isDarkMode)}>
                    {isDarkMode ? 'Switch to light' : 'Switch to dark'}
                  </button>
                </div>

                <div className="landing-features">
                  <span>Website ideas</span>
                  <span>Study help</span>
                  <span>Business strategy</span>
                  <span>AI coding</span>
                </div>
              </div>

              <div className="landing-visual" aria-hidden="true">
                <div className="visual-panel main-panel-card">
                  <div className="visual-header">
                    <span className="dot green" />
                    <span className="dot yellow" />
                    <span className="dot red" />
                  </div>
                  <div className="visual-content">
                    <div className="mini-card accent">
                      <small>Performance</small>
                      <strong>94%</strong>
                    </div>
                    <div className="mini-card">
                      <small>Ideas</small>
                      <strong>24</strong>
                    </div>
                    <div className="signal-bars">
                      <span style={{ height: '35%' }} />
                      <span style={{ height: '55%' }} />
                      <span style={{ height: '75%' }} />
                      <span style={{ height: '100%' }} />
                      <span style={{ height: '88%' }} />
                    </div>
                  </div>
                </div>

                <div className="floating-note note-one">
                  <span>AI workflow</span>
                  <strong>Optimized</strong>
                </div>
                <div className="floating-note note-two">
                  <span>Next step</span>
                  <strong>Launch plan</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export default App
