require('dotenv').config();
let mongoose=require('mongoose');
console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String
});

let User = mongoose.model('User', userSchema);

const createAndSaveUser = async (username,done) => {
  let doc = new User({ 
    username: username
  });
  console.log(doc)
  await doc.save(function (err,data) {
    if (err) return console.log(err);
    done(null , data);
  });
};
const findUser = async (userId,done) => {
  await User.findById(userId,function (err,doc){
     if (err) return console.log(err);
    user=doc;
    console.log(user+"success")
    done(null , doc);
  });
};




exports.userModel=User
exports.createAndSaveUser=createAndSaveUser;
exports.findUser=findUser;