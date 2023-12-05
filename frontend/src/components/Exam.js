import React, { useState, useEffect } from 'react';
import './examPage.css'; // Import the CSS file

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [questionInfo, setQuestionInfo] = useState({});
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const app_name = 'smart-tooth-577ede9ea626'

  function buildPath(route)
  {
      if (process.env.NODE_ENV === 'production')
      {
          return 'https://' + app_name + '.herokuapp.com/' + route;
      }
      else
      {
        return 'http://localhost:5000/' + route;
      }
  }

  const handleAnswerClick = async (questionId, selectedAnswer) => {
  const correctAnswer = questionInfo[questionId]?.correctAnswer;

  try
  {
    const obj = 
    {
      id: "65623cb210dcacc0c1486814",
      testId: "6564f0a624cfd1bdc400901e",
      questionId: questionId,
      correct: selectedAnswer === correctAnswer,
    };
    var js = JSON.stringify(obj);

    const response = await fetch(buildPath('api/answerquestion'), {
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log('Answer submitted:', result);

    } catch (error) {
      console.error('Error answering question:', error);
    }
  };

  const handleCompleteTest = async () => {
    // Call the endpoint to complete the test
    try {

      const obj = 
      {
        id: "65623cb210dcacc0c1486814",
        testId: "6564f0a624cfd1bdc400901e"
      };
      var js = JSON.stringify(obj);
  
      const response = await fetch(buildPath('api/answerquestion'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
  
      const result = await response.json();
      console.log('Answer submitted:', result);     


     
      setIsTestCompleted(true);
    } catch (error) {
      console.error('Error completing test:', error);
    }
  };

  useEffect(() => {
    // Fetch questions from the 'getquestions' endpoint when the component mounts
    const fetchQuestions = async () => {
    var obj = {id:"6564f0a624cfd1bdc400901e"};
    var js = JSON.stringify(obj);
      try 
      {
        const response = await fetch(buildPath('api/getquestions'),
        {method:'POST',body:js,headers:{'Content-Type':
        'application/json'}});
        const data = await response.json();
        setQuestions(data.results);
        const info = {};
        data.results.forEach((question) => {
          info[question._id] = {
            numberAnswers: question.NumberAnswers,
            correctAnswer: question.CorrectAnswer,
            subject: question.Subject,
          };

        setQuestionInfo(info);
        });
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div>
      <h1>Test Name</h1>
      {questions.map((question) => (
        <div key={question._id}>
          <h3>{question.Question}</h3>
          <ul>
            {question.Answers.map((answer, index) => (
              <li key={index} onClick={() => handleAnswerClick(question._id, answer)}>
                {answer}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={handleCompleteTest} disabled={isTestCompleted}>
        {isTestCompleted ? 'Test Completed' : 'Complete Test'}
      </button>
    </div>
  );



};

export default Exam;
