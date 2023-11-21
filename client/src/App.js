import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const newWs = new WebSocket('wss://sockets.vydanasindhu.repl.co/');
    newWs.onmessage = (event) => {
      // Check if the message is a Blob
      if (event.data instanceof Blob) {
        // Convert Blob to text
        const reader = new FileReader();
        reader.onload = function() {
          if (reader.result) {
            setMessages(prev => [...prev, reader.result.toString()]);
          }
        };
        reader.readAsText(event.data);
      } else {
        // Handle as normal text
        setMessages(prev => [...prev, event.data]);
      }
    };
    setWs(newWs);
    return () => newWs.close();
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === ws.OPEN && input) {
      ws.send(input);
      setInput('');
    }
  };

  return (
    <div className="App">
      <div className="Chat">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
        <div className="Messages">
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
