//all the modules are here//

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const alert = require('alert');
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
//modules get started//

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

// some variables

var datetime = new Date();
const todayDate = datetime.toISOString().slice(0, 10);
var name;
var email;
var i = 0;
var que;
var optA;
var optB;
var optC;
var optD;
var ans;
var totalQuestion;
var score = 0;
var correct = 0;
var wrong = 0;
var left;
var text;

//nodemailer here
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'xyz@gmail.com',
    pass: 'your password'
  }
});


//entire mongoose here

mongoose.connect('mongodb://localhost:27017/quizDB');

const quizSchema = {
  question: {
    type: String,
    required: true,
    minLength: 2
  },
  optionA: {
    type: String,
    required: true,
    minLength: 2
  },
  optionB: {
    type: String,
    required: true,
    minLength: 2
  },
  optionC: {
    type: String,
    required: true,
    minLength: 2
  },
  optionD: {
    type: String,
    required: true,
    minLength: 2
  },
  answer: {
    type: String,
    requried: true,
    minLength: 2
  }
};

const Question = mongoose.model("QUESTIONS", quizSchema);



//routes are diclared//

app.get("/", function(req, res) {
  res.render("starting");
  correct = 0;
  wrong = 0;
  i = 0;
  score = 0;
});

app.post("/", function(req, res) {



  if (req.body.button === "start") {
    name = req.body.name.toUpperCase();
    email = req.body.email;


    if (name === "" && email === "") {
      res.render("error", {
        message: "PLEASE ENTER A NAME & EMAIL"
      });
    } else if (name === "") {
      res.render("error", {
        message: "PLEASE ENTER A NAME"
      });
    } else if (email === "") {
      res.render("error", {
        message: "PLEASE ENTER A EMAIL"
      });
    } else {
      res.redirect("/quiz");

    }
  } else {
    res.redirect("/password");
  }


});



app.get("/quiz", function(req, res) {

  Question.find({}, function(err, found) {

    totalQuestion = found.length;
    left = totalQuestion - correct - wrong;

    if(correct + wrong < totalQuestion){
     que = found[i].question.toUpperCase();
     optA = found[i].optionA.toUpperCase();
     optB = found[i].optionB.toUpperCase();
     optC = found[i].optionC.toUpperCase();
     optD = found[i].optionD.toUpperCase();
     ans = found[i].answer;
    res.render("quiz", {playerName: name,date: todayDate,totalQuestion: totalQuestion,questionLeft: left,score: score,wrongAns: wrong,correctAns: correct,question: que, a: optA,b: optB,c: optC,d: optD});
    }else{

          text = "YOUR SCORE IS "+ score;

           var mailOptions = {
           from: 'sender_email@gmail.com',
           to: email,
           subject: 'BASIC QUIZ SCORE',
           text: text
          };

          transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });

      res.render("score",{questions: totalQuestion, score: score, correct:correct, wrong: wrong, email : email});
    }

  });



});


app.post("/quiz", function(req, res) {

  var selected = req.body.option;

  if (selected.toUpperCase() === ans.toUpperCase()) {
    score++;
    correct++;
  } else {
    wrong++;
  }

  i++;
  res.redirect("/quiz");
});

app.get("/error", function(req, res) {
  res.render("error");
});

app.post("/error", function(req, res) {
  res.redirect("/");
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const buttonClicked = req.body.button;

  const newQuestion = new Question({
    question: req.body.question,
    optionA: req.body.optionA,
    optionB: req.body.optionB,
    optionC: req.body.optionC,
    optionD: req.body.optionD,
    answer: req.body.answer
  });

  newQuestion.save(function(err) {
    if (!err) {
      if (buttonClicked === "addMore") {
        res.redirect("/compose");
      } else {
        res.redirect("/");
      }
    } else {
      res.render("error", {
        message: 'ALL ENTRIES ARE REQURIED'
      })
    }
  });



});

app.get("/password", function(req, res) {
  res.render("password");
});

app.post("/password", function(req, res) {
  const userID = req.body.userID;
  const password = req.body.password;

  if (userID === "Jai1710" && password === "Jai@1710") {
    res.redirect("/compose")
  } else {
    res.render("error", {
      message: "EITHER USER ID OR PASSWORD IS WRONG"
    })
  }

});

app.post("/score",function(req,res){
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("server is running on port 3000");
});
