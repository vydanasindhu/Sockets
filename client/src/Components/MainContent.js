import React, { useState, useEffect } from 'react';
import leftRobotImage from '../Assets/Robot1.png';
import rightRobotImage from '../Assets/Robot2.png';
import Chat from './Chat';
import GameContentClue from './GameContentClue';
import GameContentGuess from './GameContentGuess';
import GameDiscussion from './GameDiscussion';
import questions from '../Assets/data.json';
import './Style.css';

import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

function MainContent() {

  const [gameStage, setGameStage] = useState('Landing');
  const [playerName, setPlayerName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [qno, setQno] = useState(null);

  try {
    const docRef = doc(firestore, 'unique_code', 'total');
    updateDoc(docRef, { score: 0 });
    console.log('Score updated successfully');
  } catch (error) {
    console.error('Error updating score: ', error);
    console.error('Detailed error message: ', error.message);
  }

  useEffect(() => {
    const fetchQno = async () => {
      try {
        const docRef = doc(firestore, 'unique_code', 'round1');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setQno(docSnap.data().qno); // Access the qno field
        } else {
          console.log('No such document!');
        }
      } catch (err) {
        console.error("Error fetching qno: ", err);
      }
    };

    fetchQno();
  }, []);

  const handlecluegiver = () => {
    setGameStage('Clue');
    // setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
    // console.log(qno);
    //console.log(questions[qno]);

    //if round 2 setCurrentQuestion(funquestions[qno]);
    setCurrentQuestion(questions[qno]);
    // console.log(currentQuestion);
  };

  const handleguesser = () => {
    setGameStage('Guess');
    // setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);

    //if round 2 setCurrentQuestion(funquestions[qno]);
    setCurrentQuestion(questions[qno]);
  };

  const handlecompleteround = () => {
    setGameStage('Discussion');
  };

  const handleSubmit = () => {
    setGameStage('intro');
  };

  const changeGameStage = (newStage) => {
    setGameStage(newStage);
  };


  const renderLanding = () => (
    <div>
      <input
        type="text"
        class='input'
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button class="button" onClick={handleSubmit}>Start Game</button>
    </div>
  );


  const renderClue = () => (
    <GameContentClue question={currentQuestion} funccompleteround={handlecompleteround} />
  );


  const renderGuess = () => (
    <GameContentGuess question={currentQuestion} funccompleteround={handlecompleteround} />
  );

  const renderDiscussion = () => (
    <GameDiscussion question={currentQuestion} />
  );

  const renderIntro = () => (
    <div>
      <p>Welcome to the game, {playerName}!</p>
      <button className="button" onClick={() => setGameStage('introducton')}>Continue</button>

    </div>
  );

  const renderIntroductons = () => (
    <div>
      <h1>Game Introduction</h1>
      <p>
        Welcome, curious minds! As we embark on this exciting journey,
        let's briefly explore the essence of AI - a blend of technology
        and intellect, where computers learn and make decisions,
        much like us. Now, imagine this smart technology in healthcare:
        aiding doctors, personalizing treatments, and revolutionizing care.
        Let's dive in and uncover the wonders of AI in healthcare together! 🌟🏥🤖
      </p>
      <button className="button" onClick={() => setGameStage('instruction')}>Continue</button>
    </div>
  );

  const renderInstructions = () => (
    <div>
      <h1>Game Instructions</h1>
      <h2>🌐 Welcome to the Insightful World of AI in Healthcare - The Guessing Game!</h2>
      <p>
        In each round, one player is the clue giver,
        and the other is the guesser. The clue giver describes the AI
        healthcare term without using specific taboo words in a single word,
        while the guesser tries to identify the term. Points are awarded based
        on the number of clues needed to guess correctly, with fewer clues earning more points.🎮🤔🌟
      </p>
      <button className="button" onClick={() => setGameStage('questions')}>Continue</button>

    </div>
  );


  const renderQuestions = () => (
    <div>
      <h1>Game questions</h1>
      <button className="button" onClick={() => setGameStage('Gamestart')}>Continue</button>

    </div>
  );

  function renderGamestart() {
    if (gameStage === 'Gamestart') {
      return (
        <div>
          <button class="button" onClick={handlecluegiver}  >Clue Giver</button>
          <button class="button" onClick={handleguesser}   >Guesser</button>
        </div>
      );
    }
  }

  function renderleftImages() {
    if (gameStage !== 'Clue' && gameStage !== 'Guess' && gameStage !== 'Discussion') {
      return (
        <>
          <img src={leftRobotImage} alt="Left Robot" className="sideImage" />

        </>
      );
    }
  }

  function renderrightImages() {
    if (gameStage !== 'Clue' && gameStage !== 'Guess' && gameStage !== 'Discussion') {
      return (
        <>
          <img src={rightRobotImage} alt="Left Robot" className="sideImage" />
        </>
      );
    }
  }


  return (
    <div className="mainContent" >

      {renderleftImages()}
      <div  >

        {gameStage === 'Landing' && renderLanding()}
        {gameStage === 'intro' && renderIntro()}
        {gameStage === 'introducton' && renderIntroductons()}
        {gameStage === 'instruction' && renderInstructions()}
        {gameStage === 'questions' && renderQuestions()}
        {gameStage === 'Gamestart' && renderGamestart()}
        {gameStage === 'Clue' && renderClue()}
        {gameStage === 'Guess' && renderGuess()}
        {gameStage === 'Discussion' && renderDiscussion()}



      </div>
      {renderrightImages()}

    </div>
  );
}

export default MainContent;