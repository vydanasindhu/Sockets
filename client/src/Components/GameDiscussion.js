import React, { useState, useEffect } from 'react';
import '../App.css';

function GameDiscussion({ question, currentRound, funccompletediscussion, funcToGameStart }) {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const newWs = new WebSocket('wss://sockets.vydanasindhu.repl.co/');
    newWs.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function() {
          if (reader.result) {
            setMessages(prev => [...prev, { text: reader.result.toString(), type: 'received' }]);
          }
        };
        reader.readAsText(event.data);
      } else {
        setMessages(prev => [...prev, { text: event.data, type: 'received' }]);
      }
    };
    setWs(newWs);
    return () => newWs.close();
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === ws.OPEN && input) {
      ws.send(input);
      setMessages(prev => [...prev, { text: input, type: 'sent' }]);
      setInput('');
    }
  };

  return (
    <div className="App1">
      <div className="QuestionInfo">
        <p className="Question">Question: {question.question}</p>
        <p className='Answer'>Answer: {question.answer}</p>
        <p className='Source'>Source: <a href={question.source}>Link</a></p>
      </div>
      <div className="Chat">
        <div className="Messages">
          {messages.map((message, index) => (
            <div key={index} className={`Message ${message.type === 'sent' ? 'Sent' : 'Received'}`}>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
        <button onClick={sendMessage}>Send</button>
        
        {/* Conditional rendering based on the current round */}
        {currentRound < 5 ? (
          <button className='nextQuestion' onClick={funcToGameStart}>Next Question</button>
        ) : (
          <button onClick={funccompletediscussion}>Survey</button>
        )}
      </div>
    </div>
  );
}

export default GameDiscussion;
