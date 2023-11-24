import React, { useState, useEffect } from 'react';
import leftRobotImage from '../Assets/Robot1.png';
import rightRobotImage from '../Assets/Robot2.png';
import Chat from './Chat';
import GameContentClue from './GameContentClue';
import GameContentGuess from './GameContentGuess';
import GameDiscussion from './GameDiscussion';
import SurveyComp from './SurveyComp';
import questions from '../Assets/data.json';
import './Style.css';
import { collection, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
export var docReff = 0;
function MainContent() {

  const [gameStage, setGameStage] = useState('Gamestart');
  const [playerName, setPlayerName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [qno, setQno] = useState(null);

  //set total score to 0
  try {
    const docRef = doc(firestore, 'unique_code', 'total');
    updateDoc(docRef, { score: 0 });
    console.log('Score updated successfully');
  } catch (error) {
    console.error('Error updating score: ', error);
    console.error('Detailed error message: ', error.message);
  }

  //set qno to random number for round1
  try {
    const docRef = doc(firestore, 'unique_code', 'round1');
    updateDoc(docRef, { qno: Math.floor(Math.random() * questions.length) });
    console.log('Qno round1 updated successfully');
  } catch (error) {
    console.error('Error updating Qno round1: ', error);
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

  const handlecompletediscussion = () => {
    setGameStage('Survey2');
  };

  const handleSubmit = () => {
    setGameStage('intro');
  };

  const changeGameStage = (newStage) => {
    setGameStage(newStage);
  };
  const goToGameStart = () => {
    setGameStage('Gamestart');
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
    <GameDiscussion question={currentQuestion} funccompletediscussion={handlecompletediscussion} />
  );

  const Surveytwo = () => (
    <SurveyComp />
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
      <button className="button" onClick={() => setGameStage('survey')}>Continue</button>

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
  const [answers, setAnswers] = useState({
    question1: 5,
    question2: 5,
    question3: 5,
    question4: 5
  });
  const handleSliderChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: parseInt(e.target.value) });
  };

  async function handleeSubmit(e) {
    e.preventDefault();
    try {
      docReff = await addDoc(collection(firestore, 'answerss'), answers);
      console.log("Document written with ID: ", docReff.id);

    } catch (e) {
      console.error('Error adding document: ', e);
    };
    setGameStage('questions');
  };
  const RenderSurvey = () => {
    return (
      <div className="form-container">
        <form onSubmit={handleeSubmit}>
          <label className="form-label">
            How comfortable are you with the idea of AI systems diagnosing health conditions without the oversight of a human doctor?
            <br />
            <input type="range" name="question1" min="1" max="10" value={answers.question1} onChange={handleSliderChange} />
            <div className="score-display">Score: {answers.question1}</div>
          </label>
          <br />
          <label className="form-label">
            To what extent would you trust AI to handle medical emergencies effectively? <br />
            <input type="range" name="question2" min="1" max="10" value={answers.question2} onChange={handleSliderChange} />
            <div className="score-display">Score: {answers.question2}</div>
          </label>
          <br />
          <label className="form-label">
            How much do you think AI will reduce the overall cost of healthcare? <br />
            <input type="range" name="question3" min="1" max="10" value={answers.question3} onChange={handleSliderChange} />
            <div className="score-display">Score: {answers.question3}</div>
          </label>
          <label className="form-label">
            How strongly do you belive that AI will speed up innovation in developing new treatments and drugs? <br />
            <input type="range" name="question4" min="1" max="10" value={answers.question4} onChange={handleSliderChange} />
            <div className="score-display">Score: {answers.question4}</div>
          </label>
          <br />
          <button type="submit" className='button'>Submit</button>
        </form>
      </div>
    );
  }
  function Back() {
    setGameStage('Survey2');
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
        {gameStage === 'survey' && RenderSurvey()}
        {gameStage === 'Discussion' && (<GameDiscussion
          question={currentQuestion}
          funccompletediscussion={handlecompletediscussion}
          funcToGameStart={goToGameStart}
        />)}
        {gameStage === 'Survey2' && Surveytwo()}

      </div>
      {renderrightImages()}

    </div>
  );
}

export default MainContent;