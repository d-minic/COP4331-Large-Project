import React, { useState, useEffect } from 'react';
import './examPage.css'; // Import the CSS file

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Fetch questions from the 'getquestions' endpoint when the component mounts
    const fetchQuestions = async () => {
      try {
        const response = await fetch(buildPath('/api/getquestions'));
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerClick = (questionId, answerId) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };

  const handleSubmitTest = async () => {
    try {
      // Use the 'answerquestion' endpoint to submit answers
      const response = await fetch(buildPath('/api/answerquestion'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: userAnswers }),
      });

      const result = await response.json();

      if (result.success) {
        // Use the 'completetest' endpoint to complete the test
        const completeTestResponse = await fetch(buildPath('/api/completetest'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        const completeTestResult = await completeTestResponse.json();

        if (completeTestResult.success) {
          // Handle successful completion
          alert('Test submitted successfully.');
        } else {
          alert('Error completing the test.');
        }
      } else {
        alert('Error submitting answers.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div id="exam">
      <h1>Exam</h1>
      {questions.length > 0 && (
        <>
          <p>Total Questions: {questions.length}</p>
          {questions.map((question) => (
            <div key={question.questionId}>
              <p>{question.questionText}</p>
              <ul>
                {question.answerOptions.map((option) => (
                  <li
                    key={option.answerId}
                    onClick={() => handleAnswerClick(question.questionId, option.answerId)}
                  >
                    {option.answerText}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={handleSubmitTest}>Submit Test</button>
        </>
      )}
    </div>
  );
};

export default Exam;
