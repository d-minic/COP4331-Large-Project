import React, { useState, useEffect } from 'react';
import styles from './ExamPage.module.css'; // Import the CSS file

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [questionInfo, setQuestionInfo] = useState({});
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [score, setScore] = useState(null); // Initialize score state
  const [selectedAnswers, setSelectedAnswers] = useState({}); 
  const [completionMessage, setCompletionMessage] = useState('');

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
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [questionId]: selectedAnswer,
    }));

    } catch (error) {
      console.error('Error answering question:', error);
    }
  };

  const handleCompleteTest = async () => {


    const allQuestionsAnswered = questions.every((question) => selectedAnswers[question._id]);

    if (!allQuestionsAnswered) {
      setCompletionMessage("Please answer all questions before completing the test."); 
      return;
    }


    // Call the endpoint to complete the test
    try {

      const obj = 
      {
        id: "65623cb210dcacc0c1486814",
        testId: "6564f0a624cfd1bdc400901e"
      };
      var js = JSON.stringify(obj);
  
      const response = await fetch(buildPath('api/completetest'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
  
      const result = await response.json();
      console.log('Test completed:', result);
      setIsTestCompleted(true);
      setScore(result.score);
      setCompletionMessage(`Test completed. Your score: ${Math.round(result.score)}%`);

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

  const handleClearTest = async() => {
    // Clear selected answers and remove the selected-answer class
    setSelectedAnswers({});
    const answerItems = document.querySelectorAll(`.${styles.answerItem}`);
    answerItems.forEach((item) => {
      item.classList.remove(styles['selected-answer']);
      item.classList.remove(styles['correct-answer']);
      item.classList.remove(styles['incorrect-answer']);
    });
  
    // Reset test completion state
    setIsTestCompleted(false);
  
    // Clear the score
    setScore(null);

    setCompletionMessage('');

    try {
      const obj = {
        id: "65623cb210dcacc0c1486814",
        testId: "6564f0a624cfd1bdc400901e"
      };
      const js = JSON.stringify(obj);
  
      const response = await fetch(buildPath('api/cleartest'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
  
      const result = await response.json();
      console.log('Clear test:', result);
  
    } catch (error) {
      console.error('Error clearing test:', error);
    }

  };

  return (
    <div>
      <h1 className={styles.examTitle}>Test Name</h1>
      {questions.map((question) => (
        <div key={question._id} className={styles.questionContainer}>
          <h3 className={styles.questionTitle}>{question.Question}</h3>
          <ul className={styles.answerList}>
            {question.Answers.map((answer, index) => (
              <li
                key={index}
                onClick={() => handleAnswerClick(question._id, answer)}
                className={`${styles.answerItem} ${
                  !isTestCompleted && selectedAnswers[question._id] === answer
                    ? styles['selected-answer']
                    : ''
                }${
                  isTestCompleted &&
                  selectedAnswers[question._id] === answer &&
                  questionInfo[question._id]?.correctAnswer === answer
                    ? styles['correct-answer']
                    : ''
                }${
                  isTestCompleted &&
                  selectedAnswers[question._id] === answer &&
                  questionInfo[question._id]?.correctAnswer !== answer
                    ? styles['incorrect-answer']
                    : ''
                }`}
              >
                {answer}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button
        onClick={handleCompleteTest}
        disabled={isTestCompleted}
        className={styles.button}
      >
        {isTestCompleted ? 'Test Completed' : 'Complete Test'}
      </button>
      <button onClick={handleClearTest} className={styles.button}>
          Clear Test
        </button>
        {completionMessage && <p>{completionMessage}</p>}
      {score !== null && !isTestCompleted && <p>Score: {Math.round(score)}%</p>}
    </div>
  );
};

export default Exam;