var express = require('express');
require('mongodb');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.setApp = function ( app, client )
{
    app.post('/api/sendemail', async (req, res, next) =>
    {
        // incoming: email, verificationCode
        // outgoing: error
        const { email, verificationCode} = req.body;
        var results = '';
        var error = '';
        try
        {

        const msg = {
            to: email, 
            from: 'smarttoothlearning@gmail.com', 
            subject: 'Verification Email',
            text: `Here is your verification code: ${verificationCode}`,
            html: `<p>Here is your verification code: <strong>${verificationCode}</strong></p>`,
        }
            sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })


        }
        catch(e)
        {
            error = e.toString();
        }
        var ret = { error: error, results: results };
        res.status(200).json(ret);
    });


    app.post('/api/register', async (req, res, next) =>
    {
        // incoming: login, password, firstName, lastName, email
        // outgoing: error
        const { login, password, firstName, lastName, email } = req.body;
        const friends = [];
        const verificationCode = 123456;
        const newUser = {Login:login,Password:password,FirstName:firstName,LastName:lastName, Email:email, Points:0,Friends:friends,VerificationCode:verificationCode, IsVerified: false};
        var error = '';
        const result = '';
        try
        {
            const db = client.db('SmartTooth');
            const results = await db.collection('Users').find({Login:login}).toArray();
            if( results.length > 0 )
            {
                error = "Login already used. Try another!";
        
            }
            else
            {
                result = await db.collection('Users').insertOne(newUser);

            }
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
            var email = '';
            var ret;
            if( results.length > 0 )
            {
                id = results[0]._id;
                fn = results[0].FirstName;
                ln = results[0].LastName;
                email = results[0].Email;
                const token = require("./createJWT.js");
                ret = token.createToken( id, fn, ln, email );
        
            }
             else{
                ret = {error:"Login/Password incorrect"};
            }
        }catch(e)
        {
            ret = {error:e.message};
            //error = e.toString();
        }
        //var ret = { id:id, firstName:fn, lastName:ln, email:email, error:''};
        res.status(200).json(ret);
    });

    app.post('/api/addquestion', async (req, res, next) =>
    {
        // incoming: question, answer, subject
        // outgoing: error
        const { question, answers, numberAnswers, correctAnswer, subject} = req.body;
        const newQuestion = {Question:question,Answers:answers,NumberAnswers:numberAnswers,CorrectAnswer:correctAnswer,Subject:subject,Solved:false};
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
    // incoming: login
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
        // incoming: login
        // outgoing: results[], error
        var error = '';
        const {} = req.body;
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


    app.post('/api/updatepage', async (req, res, next) =>
    {
        // incoming: name, page
        // outgoing: error
        const { name, page} = req.body;
        var error = '';
        try
        {
            const db = client.db('SmartTooth');
            await db.collection('Tests').updateOne({ Name: name }, { $set: { CurrentQuestion: page } });
        }
        catch(e)
        {
            error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
    });


    app.post('/api/searchtests', async (req, res, next) =>
    {
        // incoming: search
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



    app.post('/api/searchquestions', async (req, res, next) =>
    {
        // incoming: search
        // outgoing: results[], error
        var error = '';
        const {search} = req.body;
        var results = [];
        try
        {
            const db = client.db('SmartTooth');
            results = await db.collection('Question').find({"Subject":{$regex:search+'.*', $options:'i'}}).toArray();
        }
        catch(e)
        {
            error = e.toString();
        }
        var ret = {results:results, error:error};
        res.status(200).json(ret);
    });


    app.post('/api/getquestions', async (req, res, next) =>
    {
        // incoming: questions
        // outgoing: results
        var error = '';
        const { name } = req.body;
        var results = [];
        try
        {
            const db = client.db('SmartTooth');
            const test = await db.collection('Tests').findOne({ Name: name });

            if(test)
            {
                console.log(test.Questions);
                const questions = test.Questions;
                for(const questionId of questions)
                {
                    console.log(questionId);
                    const question = await db.collection('Question').findOne({_id:questionId});
                    if(question)
                    {
                        results.push(question);
                    }   
                }
            }
            else{
                error = "Test not found";
            }
        }catch(e)
        {
            error = e.toString();
        }
        var ret = { results:results, error:error};
        res.status(200).json(ret);
    });


    app.post('/api/testgetquestionsapi', async (req, res, next) =>
    {
        // incoming: search
        // outgoing: results[], error
        var error = '';
        let results = [];
        const {search} = req.body;
        let questionIds;
        try
        {
            const db = client.db('SmartTooth');
            const test = await db.collection('Tests').findOne({"Name":{$regex:search+'.*', $options:'i'}});
            if(test)
            {
                if(test.Questions)
                {
                    questionIds = test.Questions;
                }
                else
                {
                    error = 'Questions for test not found';
                }
                
            

            const getQuestionsResponse = await fetch('https://smart-tooth-577ede9ea626.herokuapp.com/api/getquestions', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ questions: questionIds }),
            });

            const questionsData = await getQuestionsResponse.json();
            results = questionsData.results;
            error = questionsData.error;

            } else {
                error = 'Test not found';
            }

        }
        catch(e)
        {
            error = e.toString();
        }
        var ret = {results:results, error:error};
        res.status(200).json(ret);
    });



    app.post('/api/verifyemail', async (req, res) => {
        const { login, verificationCode } = req.body;
    
        try {
        const db = client.db('SmartTooth');
        const user = await db.collection('Users').findOne({ Login: login });
    
        if (user) {
            if (user.VerificationCode === verificationCode) {
            // Mark the user's email as verified in the database.
            await db.collection('Users').updateOne({ Login: login }, { $set: { IsVerified: true } });
    
            // potentially remove code to avoid duplicate
            await db.collection('Users').updateOne({ Login: login }, { $set: { VerificationCode: null } });
    
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
}
