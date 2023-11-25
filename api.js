var express = require('express');
require('mongodb');
const { ObjectId } = require('mongodb');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


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
        let code;
        do {
            code = Math.floor(100000 + Math.random() * 900000);
        } while (code < 100000 || code >= 1000000 || code.toString().startsWith('0'));

        var verificationCode = code;
        const newUser = {Login:login,Password:password,FirstName:firstName,LastName:lastName, Email:email, Points:0,Friends:friends,VerificationCode:verificationCode, IsVerified: false};
        var error = '';
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
        // incoming: name, length, public, array of questions
        // outgoing: error
        var error = '';
        try{

            const { name, length, questions, public} = req.body;
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

            const newTest = {Name:name,Length:length,Questions:questionIds,CurrentQuestion:-1, Public:public};
            
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
        // incoming: userId, testId
        // outgoing: error
    
        var error = '';
    
        const db = client.db('SmartTooth');
        const { userId, testId } = req.body;
        const id = userId;
        try
        {
            const user = await db.collection('Users').findOne({ _id: new ObjectId(id) });
    
            if (user) {
                const activeTests = user.ActiveTests || [];
                const test = await db.collection('Tests').findOne({ _id: new ObjectId(testId) });
                if(test)
                {
                    activeTests.push(test);
                    await db.collection('Users').updateOne({ _id: new ObjectId(id) }, { $set: { ActiveTests: activeTests } });
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
                const friend = await db.collection('Users').findOne({ _id: new ObjectId(friendId)});
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
        // incoming: id, page
        // outgoing: error
        const { id, page} = req.body;
        var error = '';
        try
        {
            const db = client.db('SmartTooth');
            await db.collection('Tests').updateOne({ _id: new ObjectId(id) }, { $set: { CurrentQuestion: page } });
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

            if (user.VerificationCode == verificationCode) 
            {
                await db.collection('Users').updateOne({ _id: id }, { $set: { Password: newPassword } });

                let code;
                do {
                    code = Math.floor(100000 + Math.random() * 900000);
                } while (code < 100000 || code >= 1000000 || code.toString().startsWith('0'));
        
    
                // update to new code for later use
                await db.collection('Users').updateOne({ _id: id  }, { $set: { VerificationCode: code } });
        
            }
            else{
                error = "Invalid verification code."
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
        const { id } = req.body;
        var results = [];
        try
        {
            const db = client.db('SmartTooth');
            const test = await db.collection('Tests').findOne({ _id: new ObjectId(id) });

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
        var ret = { results:results, error:error};
        res.status(200).json(ret);
    });



    app.post('/api/verifyemail', async (req, res) => {
        const { id, verificationCode } = req.body;
    
        try {
        const db = client.db('SmartTooth');
        const user = await db.collection('Users').findOne({  _id: new ObjectId(id)  });
    
        if (user) {
            if (user.VerificationCode == verificationCode) {
            // Mark the user's email as verified in the database.
            await db.collection('Users').updateOne({  _id: new ObjectId(id) }, { $set: { IsVerified: true } });
    
            let code;
            do {
                code = Math.floor(100000 + Math.random() * 900000);
            } while (code < 100000 || code >= 1000000 || code.toString().startsWith('0'));
    

            // update to new code for later use
            await db.collection('Users').updateOne({  _id: new ObjectId(id)  }, { $set: { VerificationCode: code } });
    
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
