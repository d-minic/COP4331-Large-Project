var express = require('express');
require('mongodb');
const { ObjectId } = require('mongodb');
var token = require('./createJWT.js');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.setApp = function ( app, client )
{
    app.post('/api/sendemail', async (req, res, next) =>
    {
        // incoming: login
        // outgoing: error
        const {login} = req.body;
        var results = '';
        var error = '';
        try
        {
            const db = client.db('SmartTooth');
            const user = await db.collection('Users').findOne({Login:login});
            const userEmail = user.Email;
            const verificationCode = user.VerificationCode;

            const msg = {
                to: userEmail, 
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


    app.post('/api/register', async (req, res, next) => {
        // incoming: login, password, firstName, lastName, email
        // outgoing: error
        const { login, password, firstName, lastName, email } = req.body;
        const friends = [];
        let code;
        
        do {
            code = Math.floor(100000 + Math.random() * 900000);
        } while (code < 100000 || code >= 1000000 || code.toString().startsWith('0'));
    
        const verificationCode = code;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        
        const newUser = {
            Login: login,
            Password: hashedPassword, // Store the hashed password
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Points: 0,
            Friends: friends,
            VerificationCode: verificationCode,
            IsVerified: false
        };
    
        let error = '';
    
        try {
            const db = client.db('SmartTooth');
            const results = await db.collection('Users').find({ Login: login }).toArray();
    
            if (results.length > 0) {
                error = 'Login already used. Try another!';
            } else {
                await db.collection('Users').insertOne(newUser);
            }
        } catch (e) {
            error = e.toString();
        }
    
        const ret = { error: error };
        res.status(200).json(ret);
    });

    

app.post('/api/login', async (req, res, next) => {
        // incoming: login, password
        // outgoing: id, firstName, lastName, error
    const { login, password } = req.body;
    let error = '';

    try {
        const db = client.db('SmartTooth');
        const user = await db.collection('Users').findOne({ Login: login });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.Password);

            if (passwordMatch) {
                const { _id, FirstName, LastName, Email, Points, Friends, IsVerified } = user;
                const token = require("./createJWT.js");
                const ret = token.createToken(_id, FirstName, LastName, Email, Points, Friends, IsVerified, error);
                res.status(200).json(ret);
            } else {
                error = "Login/Password incorrect";
            }
        } else {
            error = "Login/Password incorrect";
        }
    } catch (e) {
        error = e.message;
    }

    if (error) {
        const _id = '';
        const FirstName = '';
        const LastName = '';
        const Email = '';
        const Points = -1;
        const Friends = [];
        const IsVerified = null;
        const token = require("./createJWT.js");
        const ret = token.createToken(_id, FirstName, LastName, Email, Points, Friends, IsVerified, error);
        res.status(200).json(ret);
    }
});

app.post('/api/applogin', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    const { login, password } = req.body;
    let error = '';

    try {
        const db = client.db('SmartTooth');
        const user = await db.collection('Users').findOne({ Login: login });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.Password);

            if (passwordMatch) {
                const { _id, FirstName, LastName, Email, Points, Friends, IsVerified } = user;
                const ret = { _id, FirstName, LastName, Email, Points, Friends, IsVerified, error };
                res.status(200).json(ret);
            } else {
                error = "Login/Password incorrect";
            }
        } else {
            error = "Login/Password incorrect";
        }
    } catch (e) {
        error = e.message;
    }

    if (error) {
        const _id = '';
        const FirstName = '';
        const LastName = '';
        const Email = '';
        const Points = -1;
        const Friends = [];
        const IsVerified = null;
        const ret = { _id, FirstName, LastName, Email, Points, Friends, IsVerified, error };
        res.status(200).json(ret);
    }
});


    app.post('/api/addquestion', async (req, res, next) =>
    {
        // incoming:  question, answers, correctAnswer, subject
        // outgoing: error
        const { question, answers, correctAnswer, subject} = req.body;
        const numberAnswers = answers.length;
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
        // incoming: name, creator, array of questions, isPublic
        // outgoing: error
        var error = '';
        try{

            const { name, creator, questions, isPublic} = req.body;
            const questionIds = [];

            const creatorLogin = creator || 'Anonymous';

            for (const questionData of questions)
            {
                const { Question, Answers, CorrectAnswer, Subject } = questionData;
                const newQuestion = {
                    Question,
                    Answers,
                    NumberAnswers: Answers.length,
                    CorrectAnswer,
                    Subject
                };

                const db = client.db('SmartTooth');
                const result = await db.collection('Question').insertOne(newQuestion);
                var questionID = newQuestion._id;
                questionIds.push(questionID);

            }

            const length = questions.length;

            const newTest = {Name:name,Creator:creatorLogin,Length:length,Questions:questionIds,Public:isPublic,NumberAccesses:0};
            
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
        // incoming: id, points
        // outgoing: error
        const { id, points} = req.body;
        var error = '';
        try
        {
            const db = client.db('SmartTooth');
            await db.collection('Users').updateOne({ _id: new ObjectId(id) }, { $inc: { Points: points } });
        
        }
        catch(e)
        {
            error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
    });



    app.post('/api/addfriend', async (req, res, next) => {
    // incoming: id1, id2
    // outgoing: error

    var error = '';

    const db = client.db('SmartTooth');
    const { id1, id2 } = req.body;

        try
        {
        const user1 = await db.collection('Users').findOne({ _id: new ObjectId(id1) });

        if (user1) {
            const friends1 = user1.Friends || [];
            friends1.push(new ObjectId(id2));
            await db.collection('Users').updateOne({ _id: new ObjectId(id1) }, { $set: { Friends: friends1 } });
        } else {
            error = "User " + id1 + " not found";
        }

        const user2 = await db.collection('Users').findOne({_id: new ObjectId(id2) });

        if (user2) {
            const friends2 = user2.Friends || [];
            friends2.push(new ObjectId(id1));
            await db.collection('Users').updateOne({ _id:  new ObjectId(id2) }, { $set: { Friends: friends2 } });
        } else {
            error = "User " + id2 + " not found";
        }
        }catch(e)
        {
            error = e.toString();
        }
        
    var ret = { error: error };
    res.status(200).json(ret);
    });


    app.post('/api/useraddtest', async (req, res, next) => 
    {
        // incoming: userId, testId, owner
        // outgoing: error
    
        var error = '';
    
        const db = client.db('SmartTooth');
        const { userId, testId, owner } = req.body;
        const id = userId;
        try
        {
            const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });
    
            if (user) {
                const activeTests = user.ActiveTests || [];
                const test = await db.collection('Tests').findOne({ _id: new ObjectId(testId) });
                if(test)
                {
                    const questionIds = test.Questions;

                    const questionsArray = questionIds.map(questionId => ({
                        questionId,
                        correct: null  // boolean, null if unattempted
                    })); 

                    const testEntry = {
                        TestId: test._id,
                        CurrentQuestion: 0,  
                        LastScore: null,
                        Owner: owner, //boolean allowing editing
                        Questions: questionsArray,
                        LastAccessed: new Date()
                        
                    };
                    activeTests.push(testEntry);

                    activeTests.sort((a, b) => b.LastAccessed - a.LastAccessed); //USE THIS

                    await db.collection('Users').updateOne({ _id: new ObjectId(id) }, { $set: { ActiveTests: activeTests } });
                    await db.collection('Tests').updateOne({ _id: new ObjectId(testId) }, { $inc: { NumberAccesses: 1 } });
                }
                else
                {
                    error = "Test not found";
                }
                
            } else {
                error = "User " + id + " not found";
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
    // incoming: id
    // outgoing: results[], error
    var error = '';
    const {id} = req.body;
    var results = [];
    try
    {
        const db = client.db('SmartTooth');
        const user = await db.collection('Users').findOne({ _id: new ObjectId(id)});
        if(user && user.Friends)
        {
            for(const friendId of user.Friends)
            {
                const friend = await db.collection('Users').findOne({ _id: friendId});
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
        // incoming: 
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
        // incoming: id, testId, page
        // outgoing: error
        const { id, testId, page} = req.body;
        var error = '';
        try
        {
            const db = client.db('SmartTooth');
            const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });
    
            if (user) 
            {
                const activeTests = user.ActiveTests || [];
                const testIndex = activeTests.findIndex(test => test.TestId.toString() == testId);
                if(testIndex != -1)
                {
                    activeTests[testIndex].CurrentQuestion = page;
                    activeTests[testIndex].LastAccessed = new Date();
                    activeTests.sort((a, b) => b.LastAccessed - a.LastAccessed);
                    await db.collection('Users').updateOne({ _id: new ObjectId(id) }, { $set: { ActiveTests: activeTests } });
                }
                else
                {
                    error = "Test not found in User's ActiveTests.";
                }
            }
            else
            {
                error = "User not found";
            }
        }
        catch(e)
        {
            error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
    });




app.post('/api/resetpassword', async (req, res, next) => {
        // incoming: login, newPassword, verificationCode 
        // outgoing: error
    const { login, newPassword, verificationCode } = req.body;
    var error = '';

    try {
        const db = client.db('SmartTooth');
        const user = await db.collection('Users').findOne({ Login: login });
        const id = user._id;

        if (user.VerificationCode == verificationCode) {
            // Hash the new password before storing it
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await db.collection('Users').updateOne({ _id: id }, { $set: { Password: hashedPassword } });

            let code;
            do {
                code = Math.floor(100000 + Math.random() * 900000);
            } while (code < 100000 || code >= 1000000 || code.toString().startsWith('0'));

            // Update to a new code for later use
            await db.collection('Users').updateOne({ _id: id }, { $set: { VerificationCode: code } });
        } else {
            error = "Invalid verification code.";
        }

    } catch (e) {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});



    app.post('/api/getuserinfo', async (req, res, next) => {
        // incoming: id
        // outgoing: results, error
        var error = '';
        const { id } = req.body;
        try {
            const db = client.db('SmartTooth');
            const results = await db.collection('Users').findOne({ _id: new ObjectId(id) });
            if (!results) {
                error = 'User not found';
            }
            var ret = { results: results, error: error };
            res.status(200).json(ret);
        } catch (e) {
            error = e.toString();
            var ret = { results: null, error: error };
            res.status(200).json(ret);
        }
    });


    app.post('/api/edituser', async (req, res, next) => {
        // incoming: id, firstName, lastName, email
        // outgoing: error
        const { id, firstName, lastName, email } = req.body;
        var error = '';
        try {
            const db = client.db('SmartTooth');
            await db.collection('Users').updateOne({  _id: new ObjectId(id)  }, { $set: { FirstName: firstName, LastName: lastName, Email: email } });
        } catch (e) {
            error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
    });


    app.post('/api/searchtests', async (req, res, next) =>
    {
        // incoming: search, id
        // outgoing: results[], error
        var error = '';
        const {search, id} = req.body;
        var results = [];
        let userActiveTestIds = '';
        let userActiveTests = '';
        try
        {
            const db = client.db('SmartTooth');

            const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });

            if(user)
            {
                userActiveTests = user.ActiveTests || [];
                userActiveTestIds = userActiveTests.map(testEntry => testEntry.TestId);
            }

            const publicTests = await db.collection('Tests').find({
                "Name": { $regex: search + '.*', $options: 'i' },
                "Public": true,
                "_id": { $nin: userActiveTestIds } 
            }).toArray();

            /*
            const userActiveTestDetails = await Promise.all(
                userActiveTestIds.map(async (testId) => {
                    const test = await db.collection('Tests').findOne({ _id: testId });
                    return test;
                })
            );
            */

            //console.log(userActiveTestIds);
            //console.log(publicTests);
               
            results = publicTests;
            //results = userActiveTestDetails.concat(publicTests);

        }catch(e)
        {
            error = e.toString();
        }
        var ret = {results:results, error:error};
        res.status(200).json(ret);
    });



    app.post('/api/gettests', async (req, res, next) =>
    {
        // incoming: id
        // outgoing: results[], error
        var error = '';
        const {id} = req.body;
        var results = [];
        let userActiveTestIds = '';
        let userActiveTests = '';
        try
        {
            const db = client.db('SmartTooth');

            const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });

            if(user)
            {
                userActiveTests = user.ActiveTests || [];
                userActiveTestIds = userActiveTests.map(testEntry => testEntry.TestId);
            }

            const publicTests = await db.collection('Tests').find({
                "Public": true,
                "_id": { $nin: userActiveTestIds } 
            }).toArray();

            /*
            const userActiveTestDetails = await Promise.all(
                userActiveTestIds.map(async (testId) => {
                    const test = await db.collection('Tests').findOne({ _id: testId });
                    return test;
                })
            );
            */

            //console.log(userActiveTestIds);
            //console.log(publicTests);
               
            results = publicTests;
            //results = userActiveTestDetails.concat(publicTests);

        }catch(e)
        {
            error = e.toString();
        }
        var ret = {results:results, error:error};
        res.status(200).json(ret);
    });





    app.post('/api/searchfriends', async (req, res, next) =>
    {
        // incoming: search
        // outgoing: results[], error
        var error = '';
        const {id, search} = req.body;
        var results = [];
        try
        {
            const db = client.db('SmartTooth');
            const user = await db.collection('Users').findOne({ _id: new ObjectId(id)});
            if(user && user.Friends)
            {
                for(const friendId of user.Friends)
                {
                    const friend = await db.collection('Users').findOne({ _id: friendId});
                    if(friend)
                    {
                        // Check if the search term matches 
                        const matchesSearch =
                        friend.FirstName.toLowerCase().startsWith(search.toLowerCase()) ||
                        friend.LastName.toLowerCase().startsWith(search.toLowerCase()) ||
                        friend.Login.toLowerCase().startsWith(search.toLowerCase());

                        // If search is empty or there's a match, add the friend to the results
                        if (search == '' || matchesSearch) 
                        {
                            results.push(friend);
                        }
                    }
                }
            }

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
        // incoming: id
        // outgoing: results
        var error = '';
        const { id } = req.body;
        var results = [];
        var name = '';
        try
        {
            const db = client.db('SmartTooth');
            const test = await db.collection('Tests').findOne({ _id: new ObjectId(id) });
            name = test.Name;

            if(test)
            {
                const questions = test.Questions;
                for(const questionId of questions)
                {
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
        var ret = { results:results, name:name, error:error};
        res.status(200).json(ret);
    });



    app.post('/api/verifyemail', async (req, res) => {
        const { login, verificationCode } = req.body;
    
        try {
        const db = client.db('SmartTooth');
        const user = await db.collection('Users').findOne({  Login: login  });
    
        if (user) {
            if (user.VerificationCode == verificationCode) {
            // Mark the user's email as verified in the database.
            await db.collection('Users').updateOne({  Login: login }, { $set: { IsVerified: true } });
    
            let code;
            do {
                code = Math.floor(100000 + Math.random() * 900000);
            } while (code < 100000 || code >= 1000000 || code.toString().startsWith('0'));
    

            // update to new code for later use
            await db.collection('Users').updateOne({ Login: login  }, { $set: { VerificationCode: code } });
    
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


    app.post('/api/getsharkfact', async (req, res, next) =>
    {
        // incoming: 
        // outgoing: results
        var error = '';
        const {} = req.body;
        var fact = '';
        try
        {
            const db = client.db('SmartTooth');
            const index = Math.floor(Math.random() * 20) + 1;
            const results = await db.collection('SharkFacts').findOne({ _id: index });
            fact = results.Fact;

            
        }catch(e)
        {
            error = e.toString();
        }
        var ret = { results:fact, error:error};
        res.status(200).json(ret);
    });


    app.post('/api/deletetest', async (req, res, next) => {
        // incoming: id, owner, owner
        // outgoing: error
    
        const { id, testId, owner} = req.body;
        var error = '';
    
        try {

            const db = client.db('SmartTooth');
            const test = await db.collection('Tests').findOne({ _id: new ObjectId(testId) });

            if (test) 
            {
                
                await db.collection('Users').updateOne({_id: new ObjectId(id)}, { $pull: { ActiveTests: { TestId: new ObjectId(testId) } } });
                if(owner==true)
                {
                    await db.collection('Tests').updateOne({ _id: new ObjectId(testId) }, {$set: {Creator: 'Anonymous', Public: false}});
                }
                
            } 
            else 
            {
                error = "Test not found";
            }

        } catch (e) {
            error = e.toString();
        }
    
        var ret = { error: error };
        res.status(200).json(ret);
    });


    app.post('/api/edittest', async (req, res, next) => {
        // incoming: id, testId, name, creator, isPublic, questions
        // outgoing: error
        const { id, testId, name, creator, isPublic, questions } = req.body;
        var error = '';
        try {
            const db = client.db('SmartTooth');
            let questionIds = questions;
            const length = questions.length;
            const questionObjectIds = questionIds.map(questionId => new ObjectId(questionId));
            await db.collection('Tests').updateOne({  _id: new ObjectId(testId)  }, { $set: { Name: name, Creator: creator, Length: length, Public:isPublic, Questions: questionObjectIds} });
            
            const questionsArray = questionObjectIds.map(questionId => ({
                questionId,
                correct: null  // boolean, null if unattempted
            })); 

            await db.collection('Users').updateOne(
                { _id: new ObjectId(id), 'ActiveTests.TestId': new ObjectId(testId) },
                { $set: { 'ActiveTests.$.Questions': questionsArray,
                'ActiveTests.$.LastAccessed': new Date() } }
            );
        


        } catch (e) {
            error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
    });


    app.post('/api/editquestion', async (req, res, next) => {
        // incoming: id, question, answers, correctAnswer, subject
        // outgoing: error
        const { id, question, answers, correctAnswer, subject } = req.body;
        var error = '';
        try {
            const numberAnswers = answers.length;
            const db = client.db('SmartTooth');
            await db.collection('Question').updateOne({  _id: new ObjectId(id)  }, { $set: { Question: question, Answers: answers, NumberAnswers: numberAnswers, CorrectAnswer: correctAnswer,  Subject: subject} });
        } catch (e) {
            error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
    });



    app.post('/api/getquestion', async (req, res, next) => {
        // incoming: id
        // outgoing: results, error
        const {id} = req.body;
        var error = '';
        let results = '';
        try {
            const db = client.db('SmartTooth');
            results = await db.collection('Question').findOne({  _id: new ObjectId(id)  });
        } catch (e) {
            error = e.toString();
        }
        var ret = { results: results, error: error };
        res.status(200).json(ret);
    });




    app.post('/api/answerquestion', async (req, res, next) => {
        // incoming: id, testId, questionId, correct
        // outgoing: error
        const { id, testId, questionId, correct} = req.body;
        var error = '';
        try {
            const db = client.db('SmartTooth');
            const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });
    
            if (user) 
            {
                const activeTests = user.ActiveTests || [];
                const testIndex = activeTests.findIndex(test => test.TestId.toString() == testId);
                if(testIndex != -1)
                {
                    const questions = activeTests[testIndex].Questions;
                    const questionIndex = questions.findIndex(question => question.questionId.toString() == questionId);

                    if(questionIndex != -1)
                    {
                        questions[questionIndex].correct = correct;

                        activeTests[testIndex].LastAccessed = new Date();
                        activeTests.sort((a, b) => b.LastAccessed - a.LastAccessed);

                        await db.collection('Users').updateOne({ _id: new ObjectId(id) }, { $set: { ActiveTests: activeTests } });

                        await db.collection('Users').updateOne(
                            { _id: new ObjectId(id), "ActiveTests.TestId": new ObjectId(testId) },
                            { $set: { "ActiveTests.$.Questions": questions } });
                    }
                    else
                    {
                        error = "Question not found in test.";
                    }

                }
                else
                {
                    error = "Test not found in User's ActiveTests.";
                }
            }
            else
            {
                error = "User not found";
            }

        } catch (e) {
            error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
    });


    app.post('/api/completetest', async (req, res, next) => {
        // incoming: id, testId
        // outgoing: error
        const { id, testId} = req.body;
        let percentageCorrect = null;
        var error = '';
        try {
            const db = client.db('SmartTooth');
            const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });
    
            if (user) 
            {
                const activeTests = user.ActiveTests || [];
                const testIndex = activeTests.findIndex(test => test.TestId.toString() == testId);
                if(testIndex != -1)
                {
                    const questions = activeTests[testIndex].Questions;
                    const allQuestionsAnswered = questions.every(question => question.correct !== null);
                    if(allQuestionsAnswered)
                    {
                        

                        const correctCount = questions.filter(question => question.correct === true).length;
                        const totalQuestions = questions.length;
                        percentageCorrect = (correctCount / totalQuestions) * 100;

                        activeTests[testIndex].LastScore = percentageCorrect;

                        activeTests[testIndex].LastAccessed = new Date();
                        activeTests.sort((a, b) => b.LastAccessed - a.LastAccessed);

                        await db.collection('Users').updateOne(
                            { _id: new ObjectId(id), "ActiveTests.TestId": new ObjectId(testId) },
                            { $set: { "ActiveTests": activeTests  } });
                    }
                    else
                    {
                        error = "Not all questions answered. Please finish the test before submitting.";
                    }

                }
                else
                {
                    error = "Test not found in User's ActiveTests.";
                }
            }
            else
            {
                error = "User not found";
            }

        } catch (e) {
            error = e.toString();
        }
        var ret = { score: percentageCorrect, error: error };
        res.status(200).json(ret);
    });



    app.post('/api/cleartest', async (req, res, next) => {
        // incoming: id, testId
        // outgoing: error
        const { id, testId} = req.body;
        var error = '';
        try {
            const db = client.db('SmartTooth');
            const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });
    
            if (user) 
            {
                const activeTests = user.ActiveTests || [];
                const testIndex = activeTests.findIndex(test => test.TestId.toString() == testId);
                if(testIndex != -1)
                {
                    const questions = activeTests[testIndex].Questions;

                    const updatedQuestions = questions.map(question => ({
                        ...question, correct:null
                    }));

                    activeTests[testIndex].Questions = updatedQuestions;
                    activeTests[testIndex].LastScore = null;
                    activeTests[testIndex].CurrentQuestion = 0;

                    await db.collection('Users').updateOne(
                        { _id: new ObjectId(id), "ActiveTests.TestId": new ObjectId(testId) },
                        { $set: { "ActiveTests": activeTests  } });
                    
                }
                else
                {
                    error = "Test not found in User's ActiveTests.";
                }
            }
            else
            {
                error = "User not found";
            }

        } catch (e) {
            error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
    });

    app.post('/api/removefriend', async (req, res, next) => {
        // incoming: id1, id2
        // outgoing: error
    
        var error = '';
    
        const db = client.db('SmartTooth');
        const { id1, id2 } = req.body;
    
            try
            {
            const user1 = await db.collection('Users').findOne({ _id: new ObjectId(id1) });
    
            if (user1) {
                var friends1 = user1.Friends || [];
                friends1 = friends1.filter(friendId => friendId.toString() !== id2);
                await db.collection('Users').updateOne({ _id: new ObjectId(id1) }, { $set: { Friends: friends1 } });
            } else {
                error = "User " + id1 + " not found";
            }
    
            const user2 = await db.collection('Users').findOne({_id: new ObjectId(id2) });
    
            if (user2) {
                var friends2 = user2.Friends || [];
                friends2 = friends2.filter(friendId => friendId.toString() !== id1);
                await db.collection('Users').updateOne({ _id:  new ObjectId(id2) }, { $set: { Friends: friends2 } });
            } else {
                error = "User " + id2 + " not found";
            }
            }catch(e)
            {
                error = e.toString();
            }
            
        var ret = { error: error };
        res.status(200).json(ret);
        });
        module.exports = app; // unit testing add-on
        
}
