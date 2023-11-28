import React, { useState } from 'react';
var bp = require('./Path.js');
function CardUI()
{
    var card = '';
    var question = '';
    var answer = '';
    var subject = '';
    var search = '';
    const [message,setMessage] = useState('');
    const [searchResults,setResults] = useState('');
    const [cardList,setCardList] = useState('');
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;
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
    const addQuestion = async event =>
    {
        event.preventDefault();
        var obj = {
            userId:userId,
            question:question.value,
            answer:answer.value,
            subject:subject.value
        };
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(bp.buildPath('api/login'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            var txt = await response.text();
            var res = JSON.parse(txt);
            if( res.error.length > 0 )
            {
                setMessage( "API Error:" + res.error );
            }
            else
            {
                setMessage('Question has been added');
            }
        }
        catch(e)
        {
        setMessage(e.toString());
        }
    };
    const searchCard = async event =>
    {
    event.preventDefault();
    var obj = {userId:userId,search:search.value};
    var js = JSON.stringify(obj);
    try
    {
    const response = await fetch(bp.buildPath('api/login'),
    {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
    var txt = await response.text();
    var res = JSON.parse(txt);
    var _results = res.results;
    var resultText = '';
    for( var i=0; i<_results.length; i++ )
    {
    resultText += _results[i];
    if( i < _results.length - 1 )
    {
    resultText += ', ';
    }
    }
    setResults('Card(s) have been retrieved');
    setCardList(resultText);
    }
    catch(e)
    {
    alert(e.toString());
    setResults(e.toString());
    }
    };
    return(
        <div id="cardUIDiv">
        <br />
        <input type="text" id="searchText" placeholder="Card To Search For"
        ref={(c) => search = c} />
        <button type="button" id="searchCardButton" class="buttons"
        onClick={searchCard}> Search Card</button><br />
        <span id="cardSearchResult">{searchResults}</span>
        <p id="cardList">{cardList}</p><br /><br />
        <input type="text" id="question" placeholder="Question To Add"
        ref={(c) => question = c} />
        <input type="text" id="answer" placeholder="Answer"
        ref={(c) => answer = c} />
        <input type="text" id="subject" placeholder="Subject"
        ref={(c) => subject = c} />
        <button type="button" id="addQuestionButton" class="buttons"
        onClick={addQuestion}> Add Question </button><br />
        <span id="cardAddResult">{message}</span>
        </div>
    );
}
export default CardUI;