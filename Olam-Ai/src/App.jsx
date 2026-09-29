import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { askAI } from './ai'

const starterMessages = [
  
]

const historyItems = ['New chat', 'Website ideas', 'Study helper', 'Product strategy']

const getIsLandingPage = () => {
  if (typeof window === 'undefined') return true
  return window.location.pathname === '/' || window.location.pathname === ''
}

function App() {
  const textAreaRef = useRef(null)
  const [showHome, setShowHome] = useState(getIsLandingPage)
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

  useEffect(() => {
    const handleRouteChange = () => {
      setShowHome(getIsLandingPage())
    }

    window.addEventListener('popstate', handleRouteChange)
    handleRouteChange()

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  const startNewChat = () => {
    setShowHome(false)

    if (window.location.pathname !== '/chat') {
      window.history.pushState({ page: 'chat' }, '', '/chat')
    }

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

    if (window.location.pathname !== '/chat') {
      window.history.pushState({ page: 'chat' }, '', '/chat')
    }
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
          <header className="landing-topbar">
            <div className="brand-row-inline">
              <span className="brand-square">◫</span>
              <span className="brand-name">Olam Chat</span>
              <span className="brand-sub">landing page</span>
            </div>

            <div className="topbar-actions">
              <button type="button" className="ghost-icon" aria-label="Chat options">✦</button>
              <button type="button" className="ghost-icon" aria-label="Open chat">◧</button>
              <button type="button" className="ghost-icon" aria-label="More options">⋯</button>
              <button type="button" className="top-cta" onClick={startNewChat}>Start chatting</button>
            </div>
          </header>

          <div className="landing-shell">
            <section className="hero-row">
              <div className="hero-copy">
                <h1>
                  Ask anything.
                  <br />
                  Any hour. It
                  <br />
                  answers.
                </h1>

                <p>
                  Olam Chat is an AI assistant that never clocks out. Questions at midnight or midday get the same,
                  clear, patient answer.
                </p>

                <div className="landing-actions">
                  <button type="button" className="primary-cta" onClick={startNewChat}>
                    Start chatting
                  </button>
                  <button type="button" className="secondary-cta" onClick={() => {
                    window.history.pushState({ page: 'chat' }, '', '/chat')
                    setShowHome(false)
                  }}>
                    See what it does
                  </button>
                </div>
              </div>

              <div className="hero-demo" aria-hidden="true">
                <div className="demo-card">
                  <div className="demo-header">
                    <span>Olam Chat</span>
                    <span>2:14 AM</span>
                  </div>

                  <div className="demo-chat user">How do I explain a gap in my CV?</div>
                  <div className="demo-chat bot">
                    Be brief and honest: name the gap in one line, then show what you did or learned. Then move
                    straight to your recent strengths.
                  </div>
                  <div className="demo-prompt">Where should we begin?</div>
                </div>
              </div>
            </section>

            <section className="feature-section">
              <h2>Built to be there when you need it</h2>

              <div className="feature-grid">
                <article className="feature-item">
                  <h3>Always on</h3>
                  <p>No queues, no office hours. Ask at 3 a.m. or during lunch and get an answer in seconds.</p>
                </article>

                <article className="feature-item">
                  <h3>Plain answers</h3>
                  <p>Olam explains things in clear language, then goes deeper only when you ask it to.</p>
                </article>

                <article className="feature-item">
                  <h3>Pick up where you left off</h3>
                  <p>Your conversations stay in the sidebar, so you can return to any question later.</p>
                </article>
              </div>
            </section>

            <section className="final-cta-block">
              <h2>Your next question is waiting</h2>
              <button type="button" className="primary-cta large" onClick={startNewChat}>
                Open Olam Chat
              </button>
            </section>
          </div>

          <footer className="landing-footer">
            <span>Olam Chat</span>
            <span>Answers may contain mistakes. Check anything important.</span>
          </footer>
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

            <button
              type="button"
              className="history-item back-home-btn"
              onClick={() => {
                window.history.pushState({ page: 'home' }, '', '/')
                setShowHome(true)
              }}
            >
              ← Back to landing page
            </button>
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
