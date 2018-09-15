const express = require("express");
const bodyParser = require('body-parser');
const api = require("./api");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post("/processRecording", api.processRecording);
app.post("/generatePin", api.generatePin);
app.post("/enterPin", api.enterPin);
app.post("/consent", api.consent);

app.listen(8080, () => console.log("ConvoTract server started on port 8080"));
