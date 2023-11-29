import React, { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';

const ThankYouCard = ({ score }) => (
  <div className="thank-you-card">
    <h3>Score: {score}</h3>
    <h1>Thank You for Playing!</h1>
    <p>We hope you had a fantastic time.</p>
  </div>
);

const ThankYouPage = () => {
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(firestore, 'unique_code', 'total');
      const docSnap = await getDoc(docRef);
      console.log("Thank you Fetching score");

      setScore(docSnap.data().score);
    };

    fetchData();
  }, []);

  return (
    <div>
      {score !== null && <ThankYouCard score={score} />}
    </div>
  );
};

export default ThankYouPage;
