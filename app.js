const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});


app.post('/', (req, res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://usx.api.mailchimp.com/3.0/lists/listId";

    const options = {
        method: "POST",
        auth: "name:APIkey",
    }

    const request = https.request(url, options, function(response) {
        console.log(response.statusCode);

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("Server started on port 3000");
});

