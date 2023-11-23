import React, { useState, useEffect } from 'react';
import './Style.css';
import questions from '../Assets/data.json';
import avatar1 from '../Assets/avatar1.png';
import avatar2 from '../Assets/avatar2.png';

import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase';

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
        setIsTimerActive(false);
      }
    }
  }, [timer, isTimerActive]);

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

  //pull score from database
  // useEffect(() => {
  //   const fetchScore = async () => {
  //     try {
  //       const docRef = doc(firestore, 'unique_code', 'total');
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         console.log(docSnap.data().score);
  //         setScore(docSnap.data().score);
  //       } else {
  //         console.log('No such document!');
  //       }
  //     } catch (err) {
  //       console.error("Error fetching score: ", err);
  //     }
  //   };

  //   fetchScore();
  // }, []);

  // continuously check database and update score accordingly
  useEffect(() => {
    const docRef = doc(firestore, 'unique_code', 'total');

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        console.log(doc.data().score);
        setScore(doc.data().score);
      } else {
        console.log('No such document!');
      }
    }, err => {
      console.error("Error fetching score: ", err);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);


  const sendMessage = () => {
    if (!isTimerActive) {
      alert("Time's up!");
      return;
    }
    const inputTrimmed = input.trim().toLowerCase();
    const isSingleWord = inputTrimmed.indexOf(' ') === -1;

    const containsForbiddenSubword = question.forbiddenWords.some(
      forbiddenWord => inputTrimmed.includes(forbiddenWord.toLowerCase())
    );

    if (ws && ws.readyState === ws.OPEN && inputTrimmed) {
      if (isSingleWord && !containsForbiddenSubword) {
        ws.send(inputTrimmed);
        setMessages(prev => [...prev, { text: inputTrimmed, type: 'sent' }]);
        setInput('');
      } else {
        if (!isSingleWord) {
          alert("Please enter a single word as a clue.");
        } else if (containsForbiddenSubword) {
          alert("The clue contains a forbidden word. Please try a different word.");
        }
      }
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
            <button className="button" onClick={sendMessage} >Send</button>
            <button class="button" onClick={funccompleteround}>
              {isTimerActive ? 'Submit' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}
export default GameContentClue;