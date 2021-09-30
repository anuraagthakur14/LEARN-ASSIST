var keyword_extractor = require("keyword-extractor");
const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcrypt");
var mysql = require("mysql");
const app = express();

const saltRounds = 10;
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "learn_assist",
});
connection.connect((err) => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
});

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(cors());

app.listen(5500, () => console.log('listening at 5500'));
app.use(express.static('public'));
//  Opening sentence to NY Times Article at
//  http://www.nytimes.com/2013/09/10/world/middleeast/surprise-russian-proposal-catches-obama-between-putin-and-house-republicans.html
// var sentence = "President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency."


app.post('/api', cors(), (request, response) => {
    //  Extract the keywords
    console.log(request.body);
    var username = request.body.user;
    var userID;
    var extract1 = request.body.sentence.replace(/(\r\n|\n|\r)/gm, "");
    var getUserIDQuery = "SELECT * FROM users WHERE username = '" + username + "'";

    connection.query(getUserIDQuery, (err, result, fields) => {
        if (err) throw err;
        userID = result[0].user_id;
        console.log(userID);
        var insertIntoHistory = "INSERT INTO history(user_id,extraction) VALUES(" + userID + ",'" + extract1 + "')";
        connection.query(insertIntoHistory, (err, result) => {
            if (err) throw err;
            console.log("successfully inserted a row");
        });
    });
    var extraction_result = keyword_extractor.extract(request.body.sentence, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
        return_max_ngrams: 2
    });


    response.send(extraction_result);
    response.end();
});

app.post("/api/history", cors(), (request, response) => {
    var username = request.body.user;
    getUserId(username).then(function (results) {
        for (var i in results) {
            response.write(results[i].extraction + "&&" + results[i].time + "||");
        }
        response.end();
    }).catch(function (err) {
        console.log("Promise rejection error: " + err);
    });
});

app.post("/api/v1/sign_up", cors(), (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    var checkUsernameQuery = `SELECT * FROM users WHERE username = '${username}' LIMIT 1`;
    connection.query(checkUsernameQuery, (err, result, fields) => {
        if (result.length > 0) {
            response.send({
                status: 500,
                message: "Username already taken.",
            });
        } else {
            bcrypt.hash(password, saltRounds, (error, hash) => {
                var insertIntoUsersQuery = `INSERT INTO users(username, password) VALUES ('${username}', '${hash}')`;
                connection.query(insertIntoUsersQuery, (err, result) => {
                    if (err) throw err;
                    console.log("successfully inserted a row");
                    response.send({ status: 200, message: "Insert Successful" });
                });
            });
        }
    });
});

app.post("/api/v1/login", cors(), (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    var checkLoginQuery = `SELECT * FROM users WHERE username = '${username}' LIMIT 1`;
    connection.query(checkLoginQuery, (err, result, fields) => {
        if (result.length < 1) {
            response.send({
                status: 400,
                message: "Invalid username",
            });
            return;
        }
        let hashedPassword = result[0].password;
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (result) {
                response.send({
                    status: 200,
                    message: "Login successful",
                });
            } else {
                response.send({
                    status: 400,
                    message: "Invalid username and password",
                });
            }
        });
    });
});

getUserId = function (username) {
    return new Promise(function (resolve, reject) {
        var getUserIDQuery = "SELECT * FROM users WHERE username = '" + username + "'";
        connection.query(getUserIDQuery, (err, result, fields) => {
            if (err) reject(new Error("Query failed 1"));
            else {
                var userID = result[0].user_id;
                var selectHistory = "SELECT * FROM history WHERE user_id =" + userID;
                connection.query(selectHistory, (err, result) => {
                    if (err) reject(new Error("Query failed 2"));
                    else {
                        resolve(result);
                    }
                });
            }
        });
    });
};

