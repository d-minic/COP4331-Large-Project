const request = require('supertest');
const {app, server} = require('./server');
const jwt = require('jsonwebtoken');

describe("Basic credentials testing", () => {
    test("Tests valid login", async () => {
        const response = await request(app)
        .post('/api/login')
        .send({
            login: "sa155093",
            password: "password1"
        });

        expect(response.statusCode).toBe(200);
        const decodedToken = jwt.decode(response.body.accessToken);
        //console.log(decodedToken.firstName);
        expect(decodedToken.firstName).toBe("Sarah");
        expect(decodedToken.lastName).toBe("Whitfield");
    });
    
    test("Gets top 10 friends", async () => {
        const response = await request(app)
        .post('/api/getfriends')
        .send({
            "id": "656d0128aaa2ae92a2d981b7"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.results.length).toBe(8);
    });

    test("Checks user info", async () => {
        const response = await request(app)
        .post('/api/getuserinfo')
        .send({
            "id": "656cf2f8aaa2ae92a2d981b5"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.results.FirstName).toBe("Sarah");
        expect(response.body.results.LastName).toBe("Whitfield");
    });

    test("Access question answer", async () => {
        const response = await request(app)
        .post('/api/getquestion')
        .send({
            "id": "65627823a82d88d1677c20b2"
        });
        expect(response.statusCode).toBe(200);
        //console.log(response.body.results.CorrectAnswer);
        expect(response.body.results.CorrectAnswer).toBe(13);

    });

    test("Access test and question quantity", async () => {
        const response = await request(app)
        .post('/api/getquestions')
        .send({
            "id": "656fa2b359d1c2025b3cebc3"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.results.length).toBe(5);
    });

    test("Make sure leaderboard is returning 10 users", async () => {
        const response = await request(app)
        .post('/api/getleaders')
        .send({
            
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.results.length).toBe(10);
    });
});

// add the following to the bottom of the api.js file

// module.exports = api; // for unit testing purposes