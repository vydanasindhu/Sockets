import React, { useState } from 'react';
import leftRobotImage from '../Assets/Robot1.png';
import rightRobotImage from '../Assets/Robot2.png';
import Chat from './Chat';
import Discussion from './Discussion';
import GameContentClue from './GameContentClue';
import GameContentGuess from './GameContentGuess';
import './Style.css';


function MainContent() {

  const [gameStage, setGameStage] = useState('Landing');
  const [playerName, setPlayerName] = useState('');

  const handlecluegiver = () => {
    setGameStage('Clue');
  };

  const handleguesser = () => {
    setGameStage('Guess');
  };

  const handleSubmit = () => {
    setGameStage('intro');
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
    <GameContentClue />
  );


  const renderGuess = () => (
    <GameContentGuess />
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
    if (gameStage !== 'Clue' && gameStage !== 'Guess') {
      return (
        <>
          <img src={leftRobotImage} alt="Left Robot" className="sideImage" />

        </>
      );
    }
  }

  function renderrightImages() {
    if (gameStage !== 'Clue' && gameStage !== 'Guess') {
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
        {gameStage === 'Discussion' && <Discussion />}

      </div>
      {renderrightImages()}

    </div>
  );
}

export default MainContent;