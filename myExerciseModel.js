require('dotenv').config();
let mongoose=require('mongoose');
console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;

const exerciseSchema = new Schema({
      exId:String,
      username: String,
      date: String,
      duration: Number,
      description: String
});

let Exercise = mongoose.model('Exercise', exerciseSchema);
const findUser = require("./myUserModel.js").findUser;

const createAndSaveExercise = async (exercise,done) => {
  let user;
  console.log(exercise[":_id"])
  await findUser(exercise[":_id"],function(err,data){
    if (err) return console.log(err);
    user=data
    //done(null , data);
  })
  let d="";
  if(exercise.date!=null||exercise.date!=""){
    d=Date.parse(exercise.date)
    if(d){
      let str=new Date(d)
      d=str.toDateString()
    }
  }else{
    let str=new Date()
    d=str.toDateString()
  }
  let doc = new Exercise({ 
      exId: exercise[":_id"],
      username: user.username,
      date: d,
      duration: exercise.duration,
      description: exercise.description
  });
  console.log(doc)
  doc.save(function (err,end) {
    if (err) return console.log(err);
    done(null , end);
  });
};

const getExerciseLogs = async (id,done) => {
  let user;
  let exercises=[];
  console.log(id)
  await findUser(id,function(err,data){
    if (err) return console.log(err);
    user=data
    //done(null , data);
  })
  Exercise.find({exId:id},function(err,docs){
    if (err) return console.log(err);
    docs.forEach(n=>exercises.push({
      date: n.date,
      duration: n.duration,
      description: n.description
    }))
    docs = { 
      _id: user._id,
      username: user.username,
      count:exercises.size,
      logs:exercises
  };
  console.log(docs)
    done(null , docs);
  })
};


exports.exerciseModel=Exercise
exports.createAndSaveExercise=createAndSaveExercise;
exports.getExerciseLogs=getExerciseLogs