import React, { useState, useEffect } from 'react';
import './Style.css';
import questions from '../Assets/data.json';
import avatar1 from '../Assets/avatar1.png';
import avatar2 from '../Assets/avatar2.png';

function GameContentClue({ question, funccompleteround }) {
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [clue, setClue] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  useEffect(() => {
    if (isTimerActive) {
      if (timer > 0) {
        const intervalId = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        return () => clearInterval(intervalId);
      } else {
        // Handle what happens when the timer runs out
        setIsTimerActive(false);
      }
    }
  }, [timer, isTimerActive]);

  useEffect(() => {
    const newWs = new WebSocket('wss://sockets.vydanasindhu.repl.co/');
    newWs.onmessage = (event) => {
      // Check if the message is a Blob
      if (event.data instanceof Blob) {
        // Convert Blob to text
        const reader = new FileReader();
        reader.onload = function() {
          if (reader.result) {
            setMessages(prev => [...prev, { text: reader.result.toString(), type: 'received' }]);
          }
        };
        reader.readAsText(event.data);
      } else {
        // Handle as normal text
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

  if (!question) {
    return <p>Loading...</p>;
  }

  return (
    <div className="game-content">
      <div className="scoreboard">
        <img src={avatar1} alt="Player 1 Avatar" className="avatar" />
        <span className="score">{score}</span>
        <img src={avatar2} alt="Player 2 Avatar" className="avatar" />
      </div>
      <div className="question-card">
        <p className="question">{question.question}</p>
        <h7 className="forbidden-words-heading">Forbidden words</h7>
        <ul className="forbidden-words">
          {question.forbiddenWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
        <div className="timer">{timer} seconds remaining</div>

        {/* Section for Joined Sent Messages */}
        <div className="clue-display">
          <b>Clues:</b>
          <p className="sent-messages">
            {messages
              .filter(message => message.type === 'sent')
              .map(message => message.text)
              .join(', ')}
          </p>
        </div>

        {/* Section for Joined Received Messages */}
        <div className="clue-display">
          <b>Guesses:</b>
          <p className="received-messages">
            {messages
              .filter(message => message.type === 'received')
              .map(message => message.text)
              .join(', ')}
          </p>
        </div>

        <div className="App">
          <div className="Chat">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="button" onClick={sendMessage}>Send</button>
            <button className="button" onClick={funccompleteround}>Submit</button>
          </div>
        </div>
      </div>
    </div>

  );
}
export default GameContentClue;