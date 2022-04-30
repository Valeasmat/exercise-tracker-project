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
  log:[Schema.Types.Mixed]
});

let Log = mongoose.model('Log', logSchema);

const createAndSaveLog = (username,done) => {
  let doc = new Log({ 
    username: username,
    log:[]
  });
  console.log(doc)
  doc.save(function (err,data) {
    if (err) return console.log(err);
    done(null , data);
  });
};
const findEditThenSaveLog =  (userId,exercise,done) => {
  let dur=parseInt(exercise.duration+'')
  let l={
    date: exercise.date,
    duration: dur,
    description: exercise.description
  }
  Log.findById(userId,function (err, data) {
    if (err) return console.log(err);
    data.log.push(l)
    data.count=data.log.length
    data.save((err, updatedLog) => {
      if(err) return console.log(err);
      done(null, updatedLog)
    })
  })
};

const findUsers = (done) => {
  let objs=[];
  Log.find({},function (err,docs){
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
      log:data.log
    }
    done(null , obj);
  });
};

const queryChain = (userId,params,done) => {
  let filteredLogs=[];
  let all=params.hasOwnProperty('from')
  Log.findById(userId,function (err, data) {
    if (err) return console.log(err);
    if(!all){
      data.log.forEach(n=>filteredLogs.push(n))
    }else{
      data.log.forEach(l=>{
      let ac=+(new Date(l.date).getTime())
      let fr=+(new Date(params.from).getTime())
      let too=+(new Date(params.to).getTime())
      if(ac>=fr&&ac<=too){
        filteredLogs.push(l)
        console.log(l)
      }
    })
    }
    filteredLogs.sort((a,b)=>{
      let an=+(new Date(a.date)).getTime()
      let bn=+(new Date(b.date)).getTime()
      return bn-an
    })
    if(params.hasOwnProperty("limit")){
      let lim=parseInt(params.limit)
      filteredLogs.splice(lim,filteredLogs.length-lim)
    }
    let obj={
      username: data.username,
      count:filteredLogs.length,
      _id:data._id,
      log:filteredLogs
    }
    done(null , obj);
  })
};




exports.findEditThenSaveLog=findEditThenSaveLog
exports.createAndSaveLog=createAndSaveLog;
exports.findLogsById=findLogsById;
exports.findUsers=findUsers;
exports.queryChain=queryChain;