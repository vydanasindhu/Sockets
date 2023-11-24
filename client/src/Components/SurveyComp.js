import React, { useState } from 'react';
import { updateDoc } from 'firebase/firestore';
import { docReff } from './MainContent'; // Ensure docRef is correctly imported

function SurveyComp() {

  const [answers2, setAnswers2] = useState({
    question5: 5,
    question6: 5,
    question7: 5,
    question8: 5
  });

  const handleSliderChange2 = (e) => {
    setAnswers2({ ...answers2, [e.target.name]: parseInt(e.target.value) });
  };

  async function handleeSubmit2(e) {
    e.preventDefault();
    try {
      await updateDoc(docReff, answers2);
      console.log("Document written with ID: ", docReff.id);

    } catch (e) {
      console.error('Error adding document: ', e);
    };
  };

  return (
    <div className="form-container">
      <form onSubmit={handleeSubmit2}>
        <label className="form-label">
          How comfortable are you with the idea of AI systems diagnosing health conditions without the oversight of a human doctor?
          <br />
          <input type="range" name="question5" min="1" max="10" value={answers2.question5} onChange={handleSliderChange2} />
          <div className="score-display">Score: {answers2.question5}</div>
        </label>
        <br />
        <label className="form-label">
          To what extent would you trust AI to handle medical emergencies effectively? <br />
          <input type="range" name="question6" min="1" max="10" value={answers2.question6} onChange={handleSliderChange2} />
          <div className="score-display">Score: {answers2.question6}</div>
        </label>
        <br />
        <label className="form-label">
          How much do you think AI will reduce the overall cost of healthcare? <br />
          <input type="range" name="question7" min="1" max="10" value={answers2.question7} onChange={handleSliderChange2} />
          <div className="score-display">Score: {answers2.question7}</div>
        </label>
        <label className="form-label">
          How strongly do you belive that AI will speed up innovation in developing new treatments and drugs? <br />
          <input type="range" name="question8" min="1" max="10" value={answers2.question8} onChange={handleSliderChange2} />
          <div className="score-display">Score: {answers2.question8}</div>
        </label>
        <br />
        <button type="submit" className='button'>Submit</button>
      </form>
    </div>
  );
}


export default SurveyComp;
