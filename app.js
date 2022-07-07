require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(express.static(__dirname + "/public"));
// to use css and images files which are in public folder

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function () {
    console.log("Server running on port 3000");
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
    let firstName = req.body.fname;
    let lastname = req.body.lname;
    let email = req.body.email;

    let data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastname
            }
        }]
    };

    let jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/" + process.env.ID;

    const options = {
        method: "POST",
        auth: process.env.API_KEY
    }

    const http_request = https.request(url, options, function (response) {


        if (response.statusCode == 200)
            res.sendFile(__dirname + "/success.html");
        else
            res.sendFile(__dirname + "/faliure.html");

        // response.on("data", function (data) {
        //     console.log(JSON.parse(data));
        // });
    })


    http_request.write(jsonData);
    http_request.end();
})

app.post("/faliure", function (req, res) {
    res.redirect("/");
})

setInterval(function () {
    https.get("https://newsletter-signup-vijay-cpp.herokuapp.com/");
}, 300000); // every 5 minutes (300000)


