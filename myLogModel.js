require('dotenv').config();
let mongoose=require('mongoose');
console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;

const logSchema = new Schema({
  username: String,
  count:Number,
  date: String,
  duration: Number,
  description: String,
  logs:[Schema.Types.Mixed]
});

let Log = mongoose.model('Log', logSchema);

const createAndSaveLog = async (username,done) => {
  let doc = new Log({ 
    username: username,
    logs:[]
  });
  console.log(doc)
  await doc.save(function (err,data) {
    if (err) return console.log(err);
    done(null , data);
  });
};
const findEditThenSaveLog = async (userId,exercise,done) => {
  
  let l={
    date: exercise.date,
    duration: exercise.duration,
    description: exercise.description
  }
  Log.findById(userId,function (err, data) {
    if (err) return console.log(err);
    data.logs.push(l)
    data.count=data.logs.length
    data.save((err, updatedLog) => {
      if(err) return console.log(err);
      done(null, updatedLog)
    })
  })
};

const findUsers = async (done) => {
  let objs=[];
  await Log.find({},function (err,docs){
     if (err) return console.log(err);
    docs.forEach(n=>objs.push({
      username:n.username,
      _id:n._id
    }))
    done(null , objs);
  });
};

const findLogsById = (personId, done) => {
  Log.findById(personId, function (err, data) {
    if (err) return console.log(err);
    let obj={
      username: data.username,
      count:data.count,
      _id:data._id,
      logs:data.logs
    }
    done(null , obj);
  });
};




exports.findEditThenSaveLog=findEditThenSaveLog
exports.createAndSaveLog=createAndSaveLog;
exports.findLogsById=findLogsById;
exports.findUsers=findUsers;