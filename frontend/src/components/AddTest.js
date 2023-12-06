import React, { useState, useEffect } from 'react';
import './AddTest.css';
import './navbar.css';
import logo from './smarttoothlesspixel.PNG'; 
import { Link , useNavigate} from 'react-router-dom';


const storedUserData = JSON.parse(localStorage.getItem('user_data')) || {};
const login = storedUserData.login;
const userId = storedUserData.id;

console.log(login);

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


const AddTest = () => {
    const navigate = useNavigate();
    const [testData, setTestData] = useState({
      name: '',
      isPublic: false,
      creator:login,
      questions: [
        {
          Subject: '', // Add a subject for each question
          Question: '',
          Answers: ['', ''],
          CorrectAnswer: '',
        },
      ],
    });
  
    const handleInputChange = (e, questionIndex, answerIndex) => {
        const { name, value } = e.target;
      
        setTestData((prevTestData) => {
          if (name === 'isPublic') {
            return {
              ...prevTestData,
              [name]: !prevTestData[name],
            };
          } else if (name === 'CorrectAnswer') {
            return {
              ...prevTestData,
              questions: prevTestData.questions.map((question, qIndex) =>
                qIndex === questionIndex ? { ...question, CorrectAnswer: value } : question
              ),
            };
          } else if (name === 'Answers') {
            const updatedAnswers = [...prevTestData.questions[questionIndex].Answers];
            updatedAnswers[answerIndex] = value;

            // Check if the CorrectAnswer is still a valid option
            const updatedCorrectAnswer = prevTestData.questions[questionIndex].CorrectAnswer;
            if (!updatedAnswers.includes(updatedCorrectAnswer)) {
                // If CorrectAnswer is not in the updated list, set it to blank
                return {
                    ...prevTestData,
                    questions: prevTestData.questions.map((question, qIndex) =>
                        qIndex === questionIndex
                            ? { ...question, Answers: updatedAnswers, CorrectAnswer: '' }
                            : question
                    ),
                };
            }
      
            return {
              ...prevTestData,
              questions: prevTestData.questions.map((question, qIndex) =>
                qIndex === questionIndex ? { ...question, Answers: updatedAnswers } : question
              ),
            };
          } else if (name === 'Question') {
            return {
              ...prevTestData,
              questions: prevTestData.questions.map((question, qIndex) =>
                qIndex === questionIndex ? { ...question, [name]: value } : question
              ),
            };
          } else {
            return {
              ...prevTestData,
              [name]: value,
            };
          }
        });
      };
      
  
    const handleAddQuestion = () => {
      setTestData((prevTestData) => ({
        ...prevTestData,
        questions: [
          ...prevTestData.questions,
          {
            Subject: '',
            Question: '',
            Answers: ['', ''],
            CorrectAnswer: '',
          },
        ],
      }));
    };
  
    const handleAddAnswer = (questionIndex) => {
      setTestData((prevTestData) => ({
        ...prevTestData,
        questions: prevTestData.questions.map((question, qIndex) =>
          qIndex === questionIndex
            ? { ...question, Answers: [...question.Answers, ''] }
            : question
        ),
      }));
    };
  
    const handleRemoveAnswer = (questionIndex, answerIndex) => {
      setTestData((prevTestData) => ({
        ...prevTestData,
        questions: prevTestData.questions.map((question, qIndex) =>
          qIndex === questionIndex
            ? {
                ...question,
                Answers: question.Answers.filter((_, aIndex) => aIndex !== answerIndex),
              }
            : question
        ),
      }));
    };
  
    const handleRemoveQuestion = (questionIndex) => {
      setTestData((prevTestData) => ({
        ...prevTestData,
        questions: prevTestData.questions.filter((_, qIndex) => qIndex !== questionIndex),
      }));
    };
  
    const handleSubmit = async () => {
      // Send the request with testData
      var js = JSON.stringify(testData);
      console.log(js);
        
      
      const addtestresponse = await fetch(buildPath('api/addtest'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      var results = await addtestresponse.json();
      console.log(results);
      const testId = results.testId;
      console.log(testId);
      console.log('User added test:', results);

      console.log('Sending request:', testData);

      const body = {userId:userId, testId:testId, owner:true};
      js = JSON.stringify(body);
      console.log(js);

      const useraddtestresponse = await fetch(buildPath('api/useraddtest'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
      var results = await useraddtestresponse.json();
      console.log('User added test:', results);

      console.log('Sending request:', js); 

    localStorage.setItem('testId', JSON.stringify({testId}));

      
    navigate('/exam');
     
    };
  
    return (
<div >
             <nav class="navbar">
      <ul class = "navbarul">
          <img class = "navbarimg" src={logo} height="80"></img>
          <li class = "navbarli"><a class = "navbara" href="/">Logout</a></li>
          <li class = "navbarli"><a class = "navbara" href="EditProfile">Profile</a></li>
          <li class = "navbarli"><a class = "navbara" href="Friends">Friends</a></li>
          <li class = "navbarli"><a class = "navbara" href="Leaderboard">Leaderboard</a></li>
          <li class = "navbarli"><a class = "navbara" href="Browse">Browse</a></li>
          <li class = "navbarli"><a class = "navbara" href="AddTest">Create</a></li>
          <li class = "navbarli"><a class = "navbara" href="home">Home</a></li> 
      <div id="addtestmain">
        </ul>
        </nav>
        <div className="input-container">
            <label>
                Test Name:
                <input
                type="text"
                name="name"
                value={testData.name}
                onChange={(e) => handleInputChange(e)}
                />
            </label>

            <label className="public-label">
                Public:
                <input
                type="checkbox"
                name="isPublic"
                checked={testData.isPublic}
                onChange={(e) => handleInputChange(e)}
                />
            </label>
        </div>
        <h2>Questions:</h2>
    {testData.questions.map((question, questionIndex) => (
      <div key={questionIndex}>
        <label>
          Question:
          <input
            type="text"
            name="Question"
            value={question.Question}
            onChange={(e) => handleInputChange(e, questionIndex)}
          />
        </label>
        <br />
        <label>
          Answers:
          <ul>
            {question.Answers.map((answer, answerIndex) => (
              <li key={answerIndex}>
                <input
                  type="text"
                  name="Answers"
                  value={answer}
                  onChange={(e) => handleInputChange(e, questionIndex, answerIndex)}
                />
                <button onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}>
                  Remove Answer
                </button>
              </li>
            ))}
            <button onClick={() => handleAddAnswer(questionIndex)}>Add Answer</button>
          </ul>
        </label>
        <label>
          Correct Answer:
          <select
              name="CorrectAnswer"
              value={question.CorrectAnswer}
              onChange={(e) => handleInputChange(e, questionIndex)}
            >
              {/* Blank option */}
              <option value="">Select Correct Answer</option>
              {/* Other answer options */}
              {question.Answers.map((answer, answerIndex) => (
                <option key={answerIndex} value={answer}>
                  {answer}
                </option>
              ))}
            </select>
        </label>
        <button onClick={() => handleRemoveQuestion(questionIndex)}>
          Remove Question
        </button>
        <hr />
      </div>
    ))}
    <button onClick={handleAddQuestion}>Add Question</button>
    <br />
    <button onClick={handleSubmit}>Submit</button>
        </div>
  </div>

); 
};
  
  export default AddTest;
