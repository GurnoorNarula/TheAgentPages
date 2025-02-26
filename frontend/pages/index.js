import { useState } from 'react';
import ChatInterface from '../components/ChatInterface';

export default function Home() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (message) => {
    // Send message to backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    setMessages([...messages, { text: message, sender: 'user' }, { text: data.reply, sender: 'bot' }]);
  };

  return (
    <div className="container">
      <h1>Coinbase Operator Agent Chat</h1>
      <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}
