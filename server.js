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

const createAndSaveLog = require("./myLogModel.js").createAndSaveLog;

app.post("/api/users",function (req, res,next) {
  let r=req.body
  console.log(req.body)
  createAndSaveLog(r.username,function (err, data) {
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
const findEditThenSaveLog = require("./myLogModel.js").findEditThenSaveLog;
const findLogsById = require("./myLogModel.js").findLogsById;
app.post("/api/users/:_id/exercises",function (req, res,next) {
  console.log(req.params._id)
  let r=req.body
  console.log(req.body)
  r[":_id"]=req.params._id
  let str=new Date()
  let d=str.toDateString()
    if(r.hasOwnProperty("date")){
      d=Date.parse(r.date)
      if(d){
        let str=new Date(d)
        d=str.toDateString()
      }
    }
    r.date=d;
  findEditThenSaveLog(r[":_id"],r,function (err, data) {
    console.log(r)
    if (err) {
       console.log(err)
          return next(err);
        }
    let obj={
      _id: data._id,
      username: data.username,
      date: new Date(r.date).toDateString(),
      duration: +r.duration,
      description: r.description
    }
      res.json(obj);
    });
})
const findUsers = require("./myLogModel.js").findUsers;
const queryChain = require("./myLogModel.js").queryChain;
app.get("/api/users",function (req, res,next) {
  findUsers(function (err, data) {
    if (err) {
       console.log(err)
          return next(err);
        }
      res.json(data);
    });
})
app.get("/api/users/:_id/logs",function (req, res,next) {
  console.log(req.params["_id"])
  console.log(req.query)
  if(req.query.hasOwnProperty("from")&&req.query.hasOwnProperty("to")||req.query.hasOwnProperty("limit")){
    let params={};
    if(req.query.hasOwnProperty("from")){
        params={
        from: req.query.from,
        to:req.query.to
        }
    }
    if(req.query.hasOwnProperty("limit")){
      params.limit=req.query.limit
    }
    console.log(params)
    queryChain(req.params["_id"],params,function (err, data) {
    if (err) {
       console.log(err)
          return next(err);
        }
    data.log.forEach(n=>{
      n.date=new Date(n.date).toDateString();
      n.duration=+n.duration
    })
      res.json(data);
    });
    
  }else{
    findLogsById(req.params["_id"],function (err, data) {
    if (err) {
       console.log(err)
          return next(err);
        }
    data.log.forEach(n=>{
      n.date=new Date(n.date).toDateString();
      n.duration=+n.duration
    })
      res.json(data);
    });
  }
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
