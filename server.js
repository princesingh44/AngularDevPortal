const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

var router = express.Router();

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions))

app.route("/app/question1").get((req, res) => {
  res.send({
    questionString: "How will the users access your app?",
    questionOptions: ["Mobiles Phones", "Web Application", "Other Handheld Devices"],
    questionOptionType: "checkbox",
    questionNumber: 1
  });
});

app.route('/app/question2').get((req, res) => {
  res.send({
    questionString: "Does this rely on other services to get data?",
    questionOptions: ["Yes ", "No "],
    questionOptionType: "radio",
    questionNumber: 2
  });
})

app.route('/app/question3').get((req, res) => {
  res.send({
    questionString: "Do you require a data store for this application?",
    questionOptions: ["Yes", "No"],
    questionOptionType: "radio",
    questionNumber: 3
  });
})

app.route('/app/question3a').get((req, res) => {
  res.send({
    questionString: "What kind of data store is required?",
    questionOptions: ["SQL", "NoSQL"],
    questionOptionType: "radio",
    questionNumber: 3
  });
})

app.route('/app/question4').get((req, res) => {
  res.send({
    questionString: "How many users/consumers of this app?",
    questionOptions: [],
    questionOptionType: "text",
    questionNumber: 4
  });
})

app.route('/app/question5').post((req, res) => {
  console.log(req.body);
  // res.send("the value is " + req.body);
});

app.listen(8000, () => {
    console.log('Server started!')
  })