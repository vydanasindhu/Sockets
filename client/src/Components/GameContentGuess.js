import React, { useState, useEffect } from 'react';
import './Style.css';
import questions from '../Assets/data.json';
import avatar1 from '../Assets/avatar1.png';
import avatar2 from '../Assets/avatar2.png';

import { collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

function GameContentGuess({ question, funccompleteround }) {
  const [timer, setTimer] = useState(60);
  const [guess, setGuess] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [score, setScore] = useState(0); // Added score state
  const [previousGuesses, setPreviousGuesses] = useState([]); // State for storing previous guesses
  const [ws, setWs] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [numGuesses, setnumGuesses] = useState(0);



  useEffect(() => {
    if (isTimerActive) {
      if (timer > 0) {
        const intervalId = setInterval(() => {
          setTimer(prevTimer => prevTimer - 1);
        }, 1000);
        return () => clearInterval(intervalId);
      } else {
        setIsTimerActive(false);
        // Handle timer running out
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

  useEffect(() => {
    const fetchScoreOnce = async () => {

      const docRef = doc(firestore, 'unique_code', 'total');
      const docSnap = await getDoc(docRef);
      console.log("Line 101 fetching scoree");
      if (docSnap.exists()) {
        setScore(docSnap.data().score);
      } else {
        console.log(`No such document!`);
      }
    };

    fetchScoreOnce();
  },);

  const updateScoreInFirestore = async (newScore) => {
    try {
      const docRef = doc(firestore, 'unique_code', 'total');
      await updateDoc(docRef, { score: newScore });
      console.log('Score updated successfully');
    } catch (error) {
      console.error('Error updating score: ', error);
      console.error('Detailed error message: ', error.message);
    }
  };

  if (!question) {
    return <p>Loading...</p>;
  }

  const sendMessage = () => {
    const inputTrimmed = input.trim().toLowerCase();

    if (!isTimerActive) {
      alert("Time's up!");
      return;
    }

    if (isAnswerCorrect) {
      alert("Your previous guess is correct. Click Continue to know more about the question.");
      return;
    }
    if (ws && ws.readyState === ws.OPEN && input) {
      ws.send(input);
      // handleScoreChange(inputTrimmed);

      if (inputTrimmed === question.answer.toLowerCase()) {
        var incscore = 1;
        if (numGuesses === 0) {
          incscore = 3;
        }
        else if (numGuesses === 1) {
          incscore = 2;
        }
        else {
          incscore = 1;
        }
        setScore(score + incscore);
        updateScoreInFirestore(score + incscore);
        console.log("Score after updation" + score);
        setIsAnswerCorrect(true);
      }
      setMessages(prev => [...prev, { text: input, type: 'sent' }]);
      setInput('');
      setnumGuesses(numGuesses + 1);
    }
  };


  return (
    <div className="game-content">
      <div className="scoreboard">
        <img src={avatar1} alt="Player 1 Avatar" className="avatar" />
        <span className="score">{score}</span>
        <img src={avatar2} alt="Player 2 Avatar" className="avatar" />
      </div>
      <div className="question-card">
        <p className="question">{question.question}</p>
        <div className="clue-display">
          <b>Clues:</b>
          <p className="sent-messages">
            {messages
              .filter(message => message.type === 'received')
              .map(message => message.text)
              .join(', ')}
          </p>
        </div>

        <div className="timer">{timer} seconds remaining</div>

        <div className="clue-display">
          <b>Guesses:</b>
          <p className="received-messages">
            {messages
              .filter(message => message.type === 'sent')
              .map(message => message.text)
              .join(', ')}
          </p>
        </div>
        <div className="App3">
          <div className="Chat">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="button" onClick={sendMessage} >Send</button>
            <button className="button" onClick={funccompleteround}>
              {isAnswerCorrect || !isTimerActive ? 'Continue' : 'Submit'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
export default GameContentGuess;