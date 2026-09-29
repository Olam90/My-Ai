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
          <div className="landing-shell">
            <div className="landing-badge">New: weekly plans written for you</div>

            <div className="landing-grid">
              <div className="landing-copy">
                <h1>
                  Know what's on<br />
                  track, and what<br />
                  isn't, before<br />
                  Monday's<br />
                  meeting.
                </h1>

                <p>
                  Diam AI reads your projects, flags work that is slipping, and drafts the next step.
                  Your team spends less time updating status and more time shipping.
                </p>

                <div className="landing-actions">
                  <button type="button" className="primary-cta" onClick={startNewChat}>
                    Start free for 14 days
                  </button>
                  <button type="button" className="secondary-cta" onClick={() => {
                    window.history.pushState({ page: 'chat' }, '', '/chat')
                    setShowHome(false)
                  }}>
                    Watch a 2-minute demo
                  </button>
                </div>

                <div className="metrics-row">
                  <div className="metric-item">
                    <strong>3 hrs</strong>
                    <span>saved per person, per week</span>
                  </div>
                  <div className="metric-item">
                    <strong>No setup</strong>
                    <span>connects to your tools in minutes</span>
                  </div>
                  <div className="metric-item">
                    <strong>Private</strong>
                    <span>your data is never used to train models</span>
                  </div>
                </div>
              </div>

              <div className="landing-visual" aria-hidden="true">
                <div className="prompt-card">
                  <div className="assistant-row">
                    <span className="assistant-dot" />
                    <span>Ask Diam</span>
                  </div>

                  <div className="prompt-bubble">What could delay the March launch?</div>

                  <div className="risk-list">
                    <div className="risk-item">
                      <div className="risk-copy">
                        <strong>Payment API review</strong>
                        <small>Waiting on security sign-off for 4 days</small>
                      </div>
                      <span className="status blocked">Blocked</span>
                    </div>

                    <div className="risk-item">
                      <div className="risk-copy">
                        <strong>Onboarding copy</strong>
                        <small>Writer is out Thursday and Friday</small>
                      </div>
                      <span className="status risk">At risk</span>
                    </div>

                    <div className="risk-item">
                      <div className="risk-copy">
                        <strong>Mobile release build</strong>
                        <small>Passed all checks this morning</small>
                      </div>
                      <span className="status done">Done</span>
                    </div>
                  </div>

                  <div className="prompt-actions">
                    <button type="button">Nudge security team</button>
                    <button type="button">Reassign copy</button>
                  </div>

                  <div className="tail-prompt">Ask about any project, person or deadline</div>
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
