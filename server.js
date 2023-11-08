const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
client.connect();

var cardList =
[
'Roy Campanella',
'Paul Molitor',
'Tony Gwynn',
'Dennis Eckersley',
'Reggie Jackson',
'Gaylord Perry',
'Buck Leonard',
'Rollie Fingers',
'Charlie Gehringer'
];

app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.post('/api/register', async (req, res, next) =>
{
    // incoming: login, password, firstName, lastName
    // outgoing: error
    const { login, password, firstName, lastName, email } = req.body;
    const friends = [];
    const verificationCode = 0;
    const newUser = {Login:login,Password:password,FirstName:firstName,LastName:lastName, Email:email, Points:0,Friends:friends,VerificationCode:verificationCode};
    var error = '';
    try
    {
    const db = client.db('SmartTooth');
    const result = db.collection('Users').insertOne(newUser);
    }
    catch(e)
    {
    error = e.toString();
    }
    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) =>
{
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    var error = '';
    const { login, password } = req.body;
    try
    {
        const db = client.db('SmartTooth');
        const results = await
        db.collection('Users').find({Login:login,Password:password}).toArray();
        var id = -1;
        var fn = '';
        var ln = '';
        if( results.length > 0 )
        {
            id = results[0]._id;
            fn = results[0].FirstName;
            ln = results[0].LastName;
            email = results[0].Email;
        }
    }catch(e)
    {
        error = e.toString();
    }
    var ret = { id:id, firstName:fn, lastName:ln, email:email, error:''};
    res.status(200).json(ret);
});

app.post('/api/addquestion', async (req, res, next) =>
{
    // incoming: question, answer, subject
    // outgoing: error
    const { question, answer, subject} = req.body;
    const newQuestion = {Question:question,Answer:answer,Subject:subject};
    var error = '';
    try
    {
        const db = client.db('SmartTooth');
        const result = db.collection('Question').insertOne(newQuestion);
    }
    catch(e)
    {
        error = e.toString();
    }
    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/addtest', async (req, res, next) =>
{
    // incoming: name, length, array of questions
    // outgoing: error
    var error = '';
    try{

        const { name, length, questions} = req.body;
        const questionIds = [];

        for (const questionData of questions)
        {
            const { Question, Answer, Subject } = questionData;
            const newQuestion = {
                Question,
                Answer,
                Subject
            };

            const db = client.db('SmartTooth');
            const result = await db.collection('Question').insertOne(newQuestion);
            var questionID = newQuestion._id;
            questionIds.push(questionID);

        }

        const newTest = {Name:name,Length:length,Questions:questionIds,CurrentQuestion:-1};
        
        const db = client.db('SmartTooth');
        const result = db.collection('Tests').insertOne(newTest);


    }catch(e)
    {
        error = e.toString();
    }
    var ret = { error: error };
    res.status(200).json(ret);
});


app.post('/api/addpoints', async (req, res, next) =>
{
    // incoming: login, points
    // outgoing: error
    const { login, points} = req.body;
    var error = '';
    try
    {
        const db = client.db('SmartTooth');
        await db.collection('Users').updateOne({ Login: login }, { $inc: { Points: points } });
    }
    catch(e)
    {
        error = e.toString();
    }
    var ret = { error: error };
    res.status(200).json(ret);
});



app.post('/api/addfriend', async (req, res, next) => {
  // incoming: login1, login2
  // outgoing: error

  var error = '';

  const db = client.db('SmartTooth');
  const { login1, login2 } = req.body;

    try
    {
    const user1 = await db.collection('Users').findOne({ Login: login1 });

    if (user1) {
        const friends1 = user1.Friends || [];
        friends1.push(login2);
        await db.collection('Users').updateOne({ Login: login1 }, { $set: { Friends: friends1 } });
    } else {
        error = "User " + login1 + " not found";
    }

    const user2 = await db.collection('Users').findOne({ Login: login2 });

    if (user2) {
        const friends2 = user2.Friends || [];
        friends2.push(login1);
        await db.collection('Users').updateOne({ Login: login2 }, { $set: { Friends: friends2 } });
    } else {
        error = "User " + login2 + " not found";
    }
    }catch(e)
    {
        error = e.toString();
    }
    
  var ret = { error: error };
  res.status(200).json(ret);
});




app.post('/api/getfriends', async (req, res, next) =>
{
   // incoming: login, search
   // outgoing: results[], error
   var error = '';
   const {login} = req.body;
   var results = [];
   try
   {
       const db = client.db('SmartTooth');
       const user = await db.collection('Users').findOne({Login:login});
       if(user && user.Friends)
       {
           for(const friendLogin of user.Friends)
           {
               const friend = await db.collection('Users').findOne({ "Login": friendLogin});
               if(friend)
               {
                   results.push(friend);
               }
           }
       }
      
       results.sort((a,b) => b.Points - a.Points);
       results = results.slice(0, 10);
   }
   catch(e)
   {
       error = e.toString();
   }
   var ret = {results:results, error:error};
   res.status(200).json(ret);
});



app.post('/api/getleaders', async (req, res, next) =>
{
    // incoming: login, search
    // outgoing: results[], error
    var error = '';
    const {login} = req.body;
    var results = [];
    try
    {
        const db = client.db('SmartTooth');
        results = await db.collection('Users').find({"Points":{$gt: -1}}).toArray();
        results.sort((a,b) => b.Points - a.Points);
        results = results.slice(0, 10);
    }
    catch(e)
    {
        error = e.toString();
    }
    var ret = {results:results, error:error};
    res.status(200).json(ret);
});




app.post('/api/searchtests', async (req, res, next) =>
{
    // incoming: login, search
    // outgoing: results[], error
    var error = '';
    const {search} = req.body;
    var results = [];
    try
    {
        const db = client.db('SmartTooth');
        results = await db.collection('Tests').find({"Name":{$regex:search+'.*', $options:'i'}}).toArray();
    }
    catch(e)
    {
        error = e.toString();
    }
    var ret = {results:results, error:error};
    res.status(200).json(ret);
});




//kept as example, do not use
app.post('/api/searchcards', async (req, res, next) =>
{
    // incoming: userId, search
    // outgoing: results[], error
    var error = '';
    const { userId, search } = req.body;
    var _search = search.trim();
    const db = client.db('COP4331Cards');
    const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'i'}}).toArray();
    var _ret = [];
    for( var i=0; i<results.length; i++ )
    {
    _ret.push( results[i].Card );
    }
    var ret = {results:_ret, error:error};
    res.status(200).json(ret);
});

app.post('/api/verify-email', async (req, res) => {
    const { email, verificationCode } = req.body;
  
    try {
      const db = client.db('SmartTooth');
      const user = await db.collection('Users').findOne({ Email: email });
  
      if (user) {
        if (user.VerificationCode === verificationCode) {
          // Mark the user's email as verified in the database.
          await db.collection('Users').updateOne({ Email: email }, { $set: { IsVerified: true } });
  
          // potentially remove code to avoid duplicate
          await db.collection('Users').updateOne({ Email: email }, { $set: { VerificationCode: null } });
  
          res.status(200).json({ message: 'Email verified successfully.' });
        } else {
          res.status(400).json({ error: 'Invalid email verification code.' });
        }
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

///////////////////////////////////////////////////
// For Heroku deployment
// Server static assets if in production
if (process.env.NODE_ENV === 'production')
{
// Set static folder
app.use(express.static('frontend/build'));
app.get('*', (req, res) =>
{
res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});
}

app.listen(PORT, () =>
{
console.log('Server listening on port ' + PORT);
});