import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Vanakkam! I'm your Archaeological Assistant. How can I help you explore our ancient heritage today?",
      isBot: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      console.log("Sending message to server:", inputMessage);
      const response = await fetch('http://localhost:8000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response:", data);
      
      if (data.error) {
        throw new Error(data.message || 'Server error');
      }

      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: "I apologize, I'm having trouble connecting. Please check if the server is running.",
        isBot: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <span className="chatbot-icon">🏺</span>
          Artifact AI
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Artifact AI Assistant</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
                {message.isBot && <span className="bot-icon">🏺</span>}
                <p>{message.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <span className="bot-icon">🏺</span>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              {isTyping ? (
                <span className="loading-spinner"></span>
              ) : (
                <span>↗</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 