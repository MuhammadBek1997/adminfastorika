import { useState, useEffect } from 'react'
import { Paperclip, Send, X, FileText, ChevronDown, Menu, ChevronLeft } from 'lucide-react'
import { useGlobalContext } from '../context'
import '../styles/Support.css'

const Support = () => {
  const [selectedConversation, setSelectedConversation] = useState(0)
  const [message, setMessage] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  let {sidebarWidth,sidebarCollapsed,t} = useGlobalContext()

  // Check screen size and auto-collapse on mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      user: 'UserName',
      email: 'user@email.com',
      lastMessage: 'Hello, I have difficulties starting a new venture. Can you help?',
      time: '14:20',
      date: 'November 2, 2025',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Hello, I have difficulties with launching a new business. Please help me!',
          time: '14:05',
          avatar: 'U'
        },
        {
          id: 2,
          sender: 'admin',
          text: 'Hello, I have difficulties starting a new venture. Can you help?',
          time: '14:20',
          avatar: 'AA'
        }
      ]
    },
    {
      id: 2,
      user: 'Jane Smith',
      email: 'jane@email.com',
      lastMessage: 'Hello, I am facing issues while creating a new enterprise. I would appreciate your help!',
      time: '14:20',
      date: 'November 2, 2025',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Hello, I have difficulties starting a new venture. Can you help?',
          time: '14:05',
          avatar: 'JS'
        },
        {
          id: 2,
          sender: 'admin',
          text: 'Hello, I have difficulties starting a new venture. Can you help?',
          time: '14:20',
          avatar: 'AA'
        },
        {
          id: 3,
          sender: 'user',
          text: 'Hello, I am experiencing difficulties with launching a new business. Please help!',
          time: '14:05',
          avatar: 'JS'
        },
        {
          id: 4,
          sender: 'admin',
          text: 'Hello, I have difficulties starting a new venture. Can you help?',
          time: '14:20',
          avatar: 'AA',
          attachment: {
            name: 'filename.PNG',
            size: '68.4 KB'
          }
        }
      ]
    },
    {
      id: 3,
      user: 'Michael Brown',
      email: 'michael@email.com',
      lastMessage: 'Hello, I am having difficulties starting a new business. Can you help?',
      time: '14:20',
      date: 'November 2, 2025',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Hello, I am experiencing difficulties with starting a new project. Kindly assist me. Thank you!',
          time: '14:05',
          avatar: 'MB'
        },
        {
          id: 2,
          sender: 'admin',
          text: 'Hello, I have difficulties starting a new venture. Can you help?',
          time: '14:20',
          avatar: 'AA'
        },
        {
          id: 3,
          sender: 'user',
          text: 'Hello, I am facing difficulties with starting a new enterprise. Can you please help?',
          time: '14:05',
          avatar: 'MB'
        },
        {
          id: 4,
          sender: 'admin',
          text: 'Hello, I have difficulties starting a new venture. Can you help?',
          time: '14:20',
          avatar: 'AA'
        },
        {
          id: 5,
          sender: 'user',
          text: 'Hello, I am having difficulties starting a new project. Can you help?',
          time: '14:05',
          avatar: 'MB'
        },
        {
          id: 6,
          sender: 'admin',
          text: 'Hello, I have difficulties starting a new venture. Can you help?',
          time: '14:20',
          avatar: 'AA',
          attachment: {
            name: 'filename.PNG',
            size: '68.4 KB'
          }
        }
      ]
    },
    {
      id: 4,
      user: 'Sarah Wilson',
      email: 'sarah@email.com',
      lastMessage: 'Hello, I am facing difficulties while creating a new project. I would appreciate your help!',
      time: '14:20',
      date: 'March 12, 2025',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Hello, I have difficulties starting a new venture. Can you help?',
          time: '14:05',
          avatar: 'SW'
        },
        {
          id: 2,
          sender: 'admin',
          text: 'Hello, I have difficulties starting a new venture. Can you help?',
          time: '14:20',
          avatar: 'AA'
        }
      ]
    }
  ]

  const currentConversation = conversations[selectedConversation]

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      setMessage('')
      setAttachments([])
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setAttachments([...attachments, ...files])
  }

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleConversationSelect = (index) => {
    setSelectedConversation(index)
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  // Get unique users from conversations with their conversation index
  const uniqueUsers = conversations.reduce((acc, conv, index) => {
    if (!acc.find(u => u.email === conv.email)) {
      acc.push({ 
        user: conv.user, 
        email: conv.email,
        initials: conv.user.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        conversationIndex: index
      })
    }
    return acc
  }, [])

  return (
    <div className="support-container">
      {/* Sidebar Toggle Button for Mobile/Tablet */}
      <button 
        className="support-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
        style={{
            left:sidebarOpen ? `${Number(sidebarWidth.slice(0,2))+184}px`: !sidebarCollapsed ? `${Number(sidebarWidth.slice(0,2))+260}px`:`${Number(sidebarWidth.slice(0,1))+86}px`
        }}
      >
        {
            sidebarOpen
            ?
            <ChevronLeft size={20} />
            :
            <Menu size={20} />

        }
      </button>

      {/* Users List Below Toggle */}
      {!sidebarOpen && (
        <div className="support-users-list" style={{
            left:sidebarOpen ? `${Number(sidebarWidth.slice(0,2))+184}px`: !sidebarCollapsed ? `${Number(sidebarWidth.slice(0,2))+260}px`:`${Number(sidebarWidth.slice(0,1))+86}px`
        }}>
          {uniqueUsers.map((user) => (
            <div 
              key={user.email}
              className={`support-user-item ${selectedConversation === user.conversationIndex ? 'active' : ''}`}
              title={user.user}
              onClick={() => handleConversationSelect(user.conversationIndex)}
            >
              {user.initials}
            </div>
          ))}
        </div>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="support-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Conversations List */}
      <div className={`support-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="support-sidebar-header">
          <h2 className="support-sidebar-title">{t('support') || 'Поддержка'}</h2>
          <input
            type="text"
            placeholder={t('search') || 'Поиск...'}
            className="support-search"
          />
        </div>
        <div className="support-conversations">
          {conversations.map((conv, index) => (
            <div
              key={conv.id}
              className={`support-conversation-item ${selectedConversation === index ? 'active' : ''}`}
              onClick={() => handleConversationSelect(index)}
            >
              <div className="support-conversation-header">
                <div className="support-conversation-user">{conv.user}</div>
                <div className="support-conversation-time">{conv.time}</div>
              </div>
              <div className="support-conversation-preview">{conv.lastMessage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="support-chat">
        {/* Chat Header */}
        <div className="support-chat-header">
          <div className="support-chat-avatar">
            {currentConversation.user.substring(0, 1)}
          </div>
          <div className="support-chat-user-info">
            <div className="support-chat-user-name">{currentConversation.user}</div>
            <div className="support-chat-user-email">{currentConversation.email}</div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="support-chat-messages">
          <div className="support-date-divider">{currentConversation.date}</div>
          {currentConversation.messages.map((msg) => (
            <div key={msg.id} className={`support-message ${msg.sender === 'admin' ? 'sent' : 'received'}`}>
              <div className="support-message-avatar">{msg.avatar}</div>
              <div className="support-message-content">
                <div className="support-message-bubble">{msg.text}</div>
                {msg.attachment && (
                  <div className="support-message-attachment">
                    <div className="support-message-attachment-icon">
                      <FileText size={16} />
                    </div>
                    <div className="support-message-attachment-info">
                      <div className="support-message-attachment-name">{msg.attachment.name}</div>
                      <div className="support-message-attachment-size">{msg.attachment.size}</div>
                    </div>
                  </div>
                )}
                <div className="support-message-time">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="support-chat-input-wrapper">
          {attachments.length > 0 && (
            <div className="support-chat-attachments">
              {attachments.map((file, index) => (
                <div key={index} className="support-chat-attachment-preview">
                  <FileText size={14} />
                  <span>{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="support-chat-attachment-remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="support-chat-input-container">
            <div className="support-user-dropdown">
              <button
                className="support-user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="support-chat-avatar">U</div>
                <ChevronDown size={16} />
              </button>
              {showUserMenu && (
                <div className="support-user-menu">
                  <button className="support-user-menu-item" >
                    <div className="support-chat-avatar">U</div>
                    <span>UserName</span>
                  </button>
                </div>
              )}
            </div>
            <textarea
              className="support-chat-input"
              placeholder={t('writeMessage') || 'Написать сообщение...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <div className="support-chat-actions">
              <label htmlFor="file-upload" className="support-chat-action-btn">
                <Paperclip size={18} />
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
              </label>
              <button
                className="support-chat-action-btn support-chat-send-btn"
                onClick={handleSend}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support
