const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var bodyParser=require('body-parser');
const router = express.Router();
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use('/',function(req, res, next) {
  let log=`${req.method} ${req.path} - ${req.ip}`
  console.log(log);
  next();
})
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const createAndSaveUser = require("./myUserModel.js").createAndSaveUser;

app.post("/api/users",async function (req, res,next) {
  let r=req.body
  console.log(req.body)
  createAndSaveUser(r.username,function (err, data) {
    if (err) {
       console.log(err)
          return next(err);
        }
    let obj={
      username:data.username,
      _id:data._id
    }
      res.json(obj);
    });
})
const createAndSaveExercise = require("./myExerciseModel.js").createAndSaveExercise;
const findUser = require("./myUserModel.js").findUser;
app.post("/api/users/:_id/exercises",async function (req, res,next) {
  console.log(req.params._id)
  let r=req.body
  console.log(req.body)
  r[":_id"]=req.params._id
  let object;
  await findUser(r[":_id"],function (err, data) {
    if (err) {
       console.log(err)
          return next(err);
        }
    object={
      username: data.username,
      _id: data.exId
    }
    });

  await createAndSaveExercise(r,object,function (err, data) {
    console.log(object)
    if (err) {
       console.log(err)
          return next(err);
        }
    let obj={
      username: data.username,
      description: data.description,
      duration: data.duration,
      date: data.date,
      _id: data.exId
    }
      res.json(obj);
    });
})
const findUsers = require("./myUserModel.js").findUsers;
const getExerciseLogs = require("./myExerciseModel.js").getExerciseLogs;
app.get("/api/users",async function (req, res,next) {
  findUsers(function (err, data) {
    if (err) {
       console.log(err)
          return next(err);
        }
      res.json(data);
    });
})
app.get("/api/users/:_id/logs",async function (req, res,next) {
  console.log(req.params["_id"])
  getExerciseLogs(req.params["_id"],function (err, data) {
    if (err) {
       console.log(err)
          return next(err);
        }
      res.json(data);
    });
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
