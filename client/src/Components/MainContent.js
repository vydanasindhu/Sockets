import React, { useState, useEffect } from 'react';
import leftRobotImage from '../Assets/Robot1.png';
import rightRobotImage from '../Assets/Robot2.png';
import GameContentClue from './GameContentClue';
import GameContentGuess from './GameContentGuess';
import GameDiscussion from './GameDiscussion';
import SurveyComp from './SurveyComp';
import ThankYouPage from './Thankyou';
import questions from '../Assets/data.json';
import funquestions from '../Assets/fundata.json';
import './Style.css';
import { collection, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
export var docReff = 0;


function MainContent() {

  const [gameStage, setGameStage] = useState('Landing');
  const [isRoundsInitialized, setIsRoundsInitialized] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [aiview, setaiview] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [roundQuestions, setRoundQuestions] = useState({
    round1: null,
    round2: null,
    round3: null,
    round4: null,
    round5: null
  });
  const [qno, setQno] = useState(null);

  const initializeRounds = async () => {
    const totalQuestions = questions.length;
    const existingQnos = new Set();
    // Fetch existing qno for each round and add to the set
    for (let i = 1; i <= 5; i++) {
      const roundKey = `round${i}`;
      const docRef = doc(firestore, 'unique_code', roundKey);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().qno !== -1) {
        existingQnos.add(docSnap.data().qno);
      }

    }
    // Update qno for rounds where it is -1, ensuring no duplication
    for (let i = 1; i <= 5; i++) {
      const roundKey = `round${i}`;
      const docRef = doc(firestore, 'unique_code', roundKey);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().qno === -1) {
        let randomQno;
        do {
          randomQno = Math.floor(Math.random() * totalQuestions);
        } while (existingQnos.has(randomQno)); // Ensure the question is not already selected

        await updateDoc(docRef, { qno: randomQno });
        existingQnos.add(randomQno); // Add the new qno to the set to avoid duplication
      }
    }
    setIsRoundsInitialized(true);
  };
  useEffect(() => {
    if (currentRound === 1) {
      initializeRounds();
    }
  }, [currentRound]);


  //set total score to 0
  const initializeScores = async () => {
    try {
      const docRef = doc(firestore, 'unique_code', 'total');
      await updateDoc(docRef, { score: 0 });
      console.log('Score updated successfully to 0');
    } catch (error) {
      console.error('Error updating score: ', error);
      console.error('Detailed error message: ', error.message);
    }
  };

  useEffect(() => {
    if (currentRound === 1) {
      initializeScores();
    }
  }, [currentRound]);
  /*//set qno to random number for round1
  try {
        const docRef = doc(firestore, 'unique_code', 'round1');
        updateDoc(docRef, { qno: Math.floor(Math.random() * questions.length) });
        console.log('Qno round1 updated successfully');
  } catch (error) {
        console.error('Error updating Qno round1: ', error);
        console.error('Detailed error message: ', error.message);
  }*/

  useEffect(() => {
    if (isRoundsInitialized) {
      const fetchRoundQuestion = async () => {
        const roundKey = `round${currentRound}`;
        const docRef = doc(firestore, 'unique_code', roundKey);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRoundQuestions(prevQuestions => ({
            ...prevQuestions,
            [roundKey]: docSnap.data().qno
          }));
        } else {
          console.log(`No question set for ${roundKey}!`);
        }
      };

      fetchRoundQuestion();
    }
  }, [isRoundsInitialized, currentRound]);


  const handlecluegiver = () => {
    console.log(`Current round: ${currentRound}`);
    const roundKey = `round${currentRound}`;
    const questionNumber = roundQuestions[roundKey];
    console.log(`Qno: ${questionNumber}`);
    if (questionNumber !== null) {
      if (currentRound % 2 === 1) {
        setCurrentQuestion(questions[questionNumber]);
      }
      else {
        setCurrentQuestion(funquestions[questionNumber]);
      }
    }
    setGameStage('Clue');
    // setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
    // console.log(qno);
    //console.log(questions[qno]);

    //if round 2 setCurrentQuestion(funquestions[qno]);
    //setCurrentQuestion(questions[qno]);
    // console.log(currentQuestion);
  };

  const handleguesser = () => {
    console.log(`Current round: ${currentRound}`);
    const roundKey = `round${currentRound}`;
    const questionNumber = roundQuestions[roundKey];
    console.log(`Qno: ${questionNumber}`);
    if (questionNumber !== null) {
      if (currentRound % 2 === 1) {
        setCurrentQuestion(questions[questionNumber]);
      }
      else {
        setCurrentQuestion(funquestions[questionNumber]);
      }
    }
    setGameStage('Guess');
    // setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);

    //if round 2 setCurrentQuestion(funquestions[qno]);
    // setCurrentQuestion(questions[qno]);
  };

  const handlecompleteround = () => {
    setGameStage('Discussion');
  };

  const handlecompletediscussion = () => {
    setGameStage('Survey2');
    console.log("Game completed. All rounds finished.");
    resetRounds();
    console.log("Updated the docs.");
  };

  const handleSubmit = () => {
    setGameStage('intro');
  };
  const resetRounds = () => {
    for (let i = 1; i <= 5; i++) {
      const roundKey = `round${i}`;
      const docRef = doc(firestore, 'unique_code', roundKey);
      try {
        updateDoc(docRef, { qno: -1 });
        console.log('qno updated after finish');
      } catch (error) {
        console.error('Error updating qno after finish ', error);
        console.error('Detailed error message: ', error.message);
      }

    }
  };
  const changeGameStage = (newStage) => {
    setGameStage(newStage);
  };

  const handlecompletesurvey = () => {
    setGameStage("Thanku");
  };

  const goToGameStart = () => {
    if (gameStage === 'Discussion') {
      setCurrentRound(prevRound => {
        if (prevRound >= 5) {
          console.log("Game completed. All rounds finished.");
          resetRounds();
          console.log("Updated the docs.");
          return prevRound;
        } else {
          return prevRound + 1;
        }
      });
    }
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
    <SurveyComp funccompletesurvey={handlecompletesurvey} />
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


  async function handlecompleterenderquestions(e) {
    const aiview_var = { ai_view: aiview };
    e.preventDefault();
    try {
      docReff = await addDoc(collection(firestore, 'answerss'), aiview_var);
      console.log("ai-view - Document written with ID: ", docReff.id);

    } catch (e) {
      console.error('Error adding document: ', e);
    };
    setGameStage('question_intro');
  };

  const renderQuestions = () => (
    <div>
      <h3>What's your Understanding of Artificial Intelligence? 🤖</h3>
      <input
        type="text"
        value={aiview}
        onChange={handleInputChange}
        maxLength={100}
        className="text-field"
        placeholder="Your answer here..."
      />
      <button className="button" onClick={handlecompleterenderquestions}>Submit</button>
    </div>
  );

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setaiview(inputText);
  };

  const renderQuestion_intro = () => (
    <div class="thank-you-card">
      <h2>What according to Wikipedia, is AI?</h2>
      <p>Artificial intelligence (AI) refers to the intelligence of machines or
        software, as opposed to the intelligence of humans or animals.</p>

      <h2>AI in Healthcare</h2>
      <p>AI is like a smart computer system that can think, learn, and make decisions
        similarly to humans. For example, in healthcare, AI can examine X-rays and assist
        doctors in detecting diseases like cancer more quickly and accurately.
        It can also analyze vast amounts of medical records to recommend the best treatments for patients.</p>

      <p>Think of it as having a highly intelligent helper that can process a wealth of
        information and provide decision-making support based on that data.</p>

      <button className="button" onClick={() => setGameStage('yes_no')}>Submit</button>

    </div>
  );

  const renderThanku = () => {
    <ThankYouPage />
    // const docRef = doc(firestore, 'unique_code', 'total');
    // const docSnap = await getDoc(docRef);
    // console.log("Line 343 fetching scoree");

    // const score = docSnap.data().score;

    // <div class="thank-you-card">
    //   <h3>Score: ${score}</h3>
    //   <h1>Thank You for Playing!</h1>
    //   <p>We hope you had a fantastic time.</p>
    // </div>
  };

  const [yesornoanswers, yesornosetAnswers] = useState({
    yesornoq1: '',
    yesornoq2: '',
    yesornoq3: '',
    yesornoq4: '',
    yesornoq5: '',
  });

  const handleOptionChange = (questionNumber, value) => {
    yesornosetAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`yesornoq${questionNumber}`]: value,
    }));
  };

  async function handleyesornocompleted(e) {
    // Do something with the answers, e.g., send them to Firebase
    //console.log('yesornoanswers:', yesornoanswers);

    e.preventDefault();
    try {
      await updateDoc(docReff, yesornoanswers);
      // docReff = await addDoc(collection(firestore, 'answerss'), answers);
      console.log("YesorNoAnswers - Document written with ID: ", docReff.id);

    } catch (e) {
      console.error('Error adding document: ', e);
    };
    // You can call your function to set values here
    // Example: setValuesInFirestore(answers);

    // Update the game stage
    setGameStage('survey');
  };

  const renderYes_no = () => (
    <div className="thank-you-card">
      <div className="question-container">
        <h1>AI in Healthcare Questions</h1>

        <div className="question">
          <p>1. Do you think computers can be taught to help doctors diagnose diseases?</p>
          <div>
            <label>
              <input type="radio" name="question1-choice" value="Yes" checked={yesornoanswers.yesornoq1 === 'Yes'}
                onChange={() => handleOptionChange(1, 'Yes')} />
              Yes
            </label>
            <label>
              <input type="radio" name="question1-choice" value="No" checked={yesornoanswers.yesornoq1 === 'No'}
                onChange={() => handleOptionChange(1, 'No')} />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <p>2. Do you believe a computer program or AI can suggest treatment options to doctors based on a patient's medical history?</p>
          <div>
            <label>
              <input type="radio" name="question2-choice" value="Yes" checked={yesornoanswers.yesornoq2 === 'Yes'}
                onChange={() => handleOptionChange(2, 'Yes')} />
              Yes
            </label>
            <label>
              <input type="radio" name="question2-choice" value="No" checked={yesornoanswers.yesornoq2 === 'No'}
                onChange={() => handleOptionChange(2, 'No')} />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <p>3. Do you believe Artificial Intelligence can help scientists discover new medicines faster?</p>
          <div>
            <label>
              <input type="radio" name="question3-choice" value="Yes" checked={yesornoanswers.yesornoq3 === 'Yes'}
                onChange={() => handleOptionChange(3, 'Yes')} />
              Yes
            </label>
            <label>
              <input type="radio" name="question3-choice" value="No" checked={yesornoanswers.yesornoq3 === 'No'}
                onChange={() => handleOptionChange(3, 'No')} />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <p>4. Do you think using Artificial Intelligence in healthcare can make it easier for people to get medical advice?</p>
          <div>
            <label>
              <input type="radio" name="question4-choice" value="Yes" checked={yesornoanswers.yesornoq4 === 'Yes'}
                onChange={() => handleOptionChange(4, 'Yes')} />
              Yes
            </label>
            <label>
              <input type="radio" name="question4-choice" value="No" checked={yesornoanswers.yesornoq4 === 'No'}
                onChange={() => handleOptionChange(4, 'No')} />
              No
            </label>
          </div>
        </div>

        <div className="question">
          <p>5. Do you believe Artificial Intelligence can assist in managing chronic diseases like diabetes by continuously analyzing patient data?</p>
          <div>
            <label>
              <input type="radio" name="question5-choice" value="Yes" checked={yesornoanswers.yesornoq5 === 'Yes'}
                onChange={() => handleOptionChange(5, 'Yes')} />
              Yes
            </label>
            <label>
              <input type="radio" name="question5-choice" value="No" checked={yesornoanswers.yesornoq5 === 'No'}
                onChange={() => handleOptionChange(5, 'No')} />
              No
            </label>
          </div>
        </div>
      </div>
      <button className="button" onClick={handleyesornocompleted}>
        Submit
      </button>
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
    if (gameStage !== 'Clue' && gameStage !== 'Guess' && gameStage !== 'Discussion' && gameStage !== 'survey' && gameStage !== 'Survey2' && gameStage !== 'question_intro' && gameStage !== 'yes_no') {
      return (
        <>
          <img src={leftRobotImage} alt="Left Robot" className="sideImage" />

        </>
      );
    }
  }

  function renderrightImages() {
    if (gameStage !== 'Clue' && gameStage !== 'Guess' && gameStage !== 'Discussion' && gameStage !== 'survey' && gameStage !== 'Survey2' && gameStage !== 'question_intro' && gameStage !== 'yes_no') {
      return (
        <>
          <img src={rightRobotImage} alt="Left Robot" className="sideImage" />
        </>
      );
    }
  }

  //initial form

  const [answers, setAnswers] = useState({
    question1: 5,
    question2: 5,
    question3: 5,
    question4: 5
  });

  const [textquestion1, setTextquestion1] = useState('');
  const [textquestion2, setTextquestion2] = useState('');

  const handleSliderChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: parseInt(e.target.value) });
  };

  const handleInputText1Change = (e) => {
    const inputText = e.target.value;
    setTextquestion1(inputText);
  };

  const handleInputText2Change = (e) => {
    const inputText = e.target.value;
    setTextquestion2(inputText);
  };

  async function handleeSubmit(e) {
    e.preventDefault();
    try {

      const combinedUpdates = {
        textquestion1: textquestion1,
        textquestion2: textquestion2,
        ...answers,
      };
      await updateDoc(docReff, combinedUpdates);

      // docReff = await addDoc(collection(firestore, 'answerss'), answers);
      console.log("Initial Survey answers - Document written with ID: ", docReff.id);

    } catch (e) {
      console.error('Error adding document: ', e);
    };
    setGameStage('Gamestart');
  };


  const RenderSurvey = () => {
    return (
      <div class="thank-you-card">
        <div className="form-container">
          <form onSubmit={handleeSubmit}>
            <label className="form-label">
              What do you think about the benefits that  AI can bring to healthcare ? Rate from 1 to 10
              <br />
              <input
                type="text"
                className="form-textfield"
                name="text-question1"
                value={textquestion1}
                onChange={handleInputText1Change}
              />
              <br />
              <br />
              <input type="range" name="question1" min="1"
                max="10" value={answers.question1} onChange={handleSliderChange} />
              <div>
                <span>Minimum: 1</span>
                <span>Maximum: 10</span>
              </div>
              <div className="score-display">Score: {answers.question1}</div>
            </label>
            <br />
            <br />
            <label className="form-label">
              What are your views about the risks and challenges
              AI might pose in healthcare? Rate from 1 to 10
              <br />
              <input
                type="text"
                className="form-textfield"
                name="text-question2"
                value={textquestion2}
                onChange={handleInputText2Change}
              />
              <br />
              <br />
              <input type="range" name="question2" min="1"
                max="10" value={answers.question2} onChange={handleSliderChange} />
              <div className="score-display">Score: {answers.question2}</div>
            </label>
            <br />
            <br />
            <label className="form-label">
              How strongly do you belive that AI will speed up innovation
              in developing new treatments and drugs? <br />
              <input type="range" name="question3" min="1" max="10"
                value={answers.question3} onChange={handleSliderChange} />
              <div className="score-display">Score: {answers.question3}</div>
            </label>
            <br />
            <br />
            <label className="form-label">
              How significantly do you think AI will transform the
              healthcare industry in the next decade? <br />
              <input type="range" name="question4" min="1" max="10"
                value={answers.question4} onChange={handleSliderChange} />
              <div className="score-display">Score: {answers.question4}</div>
            </label>
            <br />
            <br />
            <button type="submit" className='button'>Submit</button>
          </form>
        </div>
      </div >
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
        {gameStage === 'question_intro' && renderQuestion_intro()}
        {gameStage === 'yes_no' && renderYes_no()}
        {gameStage === 'Gamestart' && renderGamestart()}
        {gameStage === 'Clue' && renderClue()}
        {gameStage === 'Guess' && renderGuess()}
        {gameStage === 'survey' && RenderSurvey()}
        {gameStage === 'Discussion' && (<GameDiscussion
          question={currentQuestion}
          currentRound={currentRound}
          funccompletediscussion={handlecompletediscussion}
          funcToGameStart={goToGameStart}
        />)}
        {gameStage === 'Survey2' && Surveytwo()}
        {gameStage === 'Thanku' && <ThankYouPage />}

      </div>
      {renderrightImages()}

    </div>
  );
}

export default MainContent;