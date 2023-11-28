import React, { useState } from 'react';
import { updateDoc } from 'firebase/firestore';
import { docReff } from './MainContent'; // Ensure docRef is correctly imported
import { interaction_cnt } from './GameDiscussion';

function SurveyComp({ funccompletesurvey }) {

  const [answers2, setAnswers2] = useState({
    question5: 5,
    question6: 5,
    question7: 5,
    question8: 5,

  });

  const [textquestion3, setTextquestion3] = useState('');
  const [textquestion4, setTextquestion4] = useState('');

  const handleSliderChange2 = (e) => {
    setAnswers2({ ...answers2, [e.target.name]: parseInt(e.target.value) });
  };

  const handleInputText3Change = (e) => {
    const inputText = e.target.value;
    setTextquestion3(inputText);
  };

  const handleInputText4Change = (e) => {
    const inputText = e.target.value;
    setTextquestion4(inputText);
  };

  async function handleeSubmit2(e) {
    e.preventDefault();
    try {
      const combinedUpdates = {
        interaction_count: interaction_cnt,
        textquestion3: textquestion3,
        textquestion4: textquestion4,
        // Assuming answers2 is an object with fields and values to update
        ...answers2,
      };
      // await updateDoc(docReff, answers2);

      await updateDoc(docReff, combinedUpdates);
      console.log("Last Survey - Document written with ID: ", docReff.id);
      funccompletesurvey();

    } catch (e) {
      console.error('Error adding document: ', e);
    };
  };

  return (
    <div class="thank-you-card">
      <div className="form-container">
        <form onSubmit={handleeSubmit2}>
          <label className="form-label">
            What do you think about the benefits that  AI can bring to healthcare ? Rate from 1 to 10
            <br />
            <input
              type="text"
              className="form-textfield"
              name="text-question3"
              value={textquestion3}
              onChange={handleInputText3Change}
            />
            <br />
            <br />
            <input type="range" name="question5" min="1"
              max="10" value={answers2.question5} onChange={handleSliderChange2} />
            <div className="score-display">Score: {answers2.question5}</div>
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
              name="text-question4"
              value={textquestion4}
              onChange={handleInputText4Change}
            />
            <br />
            <br />
            <input type="range" name="question6" min="1"
              max="10" value={answers2.question6} onChange={handleSliderChange2} />
            <div className="score-display">Score: {answers2.question6}</div>
          </label>
          <br />
          <br />
          <label className="form-label">
            How strongly do you belive that AI will speed up innovation
            in developing new treatments and drugs? <br />
            <input type="range" name="question7" min="1" max="10"
              value={answers2.question7} onChange={handleSliderChange2} />
            <div className="score-display">Score: {answers2.question7}</div>
          </label>
          <br />
          <br />
          <label className="form-label">
            How significantly do you think AI will transform the
            healthcare industry in the next decade? <br />
            <input type="range" name="question8" min="1" max="10"
              value={answers2.question8} onChange={handleSliderChange2} />
            <div className="score-display">Score: {answers2.question8}</div>
          </label>
          <br />
          <br />
          <button type="submit" className='button'>Submit</button>
        </form>
      </div>
    </div >
  );
}


export default SurveyComp;
