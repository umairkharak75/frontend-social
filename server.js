const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')



const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const auth = require('./routes/api/auth');


const app = express();


app.use(cors())
//  const http = require('http').Server(app);
//  const client = require('socket.io')(http);
const port = process.env.PORT || 5000;

var server = app.listen(port);
var client = require('socket.io').listen(server);
// Body parser middleware
app.use(express.json({ extended: false }))
//app.use(bodyParser.json());
//app.use("/", express.static(path.join(__dirname, "social-fe",'dist')));
app.use('/', express.static('social-fe/dist'));


// DB Config
// const db = require('./config/keys').mongodb;
const db= "mongodb+srv://umairkharak75:1234567890@sa-backend-cnw8q.mongodb.net/sa-backend?retryWrites=true&w=majority"
// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => {
    console.log('MongoDB Connected')

    client.on('connection', function(socket){
    //  let chat = db.collection('chats');
       console.log('conenction done')
      // Create function to send status
      sendStatus = function(s){
          socket.emit('status', s);
      }

      // Get chats from mongo collection
      ////////////////////////////////////
      /////////////////////////////////////
      // chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
      //     if(err){
      //         throw err;
      //     }

      //     // Emit the messages
      //     socket.emit('output', res);
      // });

      // Handle input events
      socket.on('input', function(data){
        console.log(data)
          let name = data.name;
          let message = data.message;

          // Check for name and message
           if(name == '' ){
          //     // Send error status
          //     sendStatus('Please enter a name and message');
           } else {
              // Insert message
              //chat.insert({name: name, message: message}, function(){
                  client.emit('output', [data]);

                  // Send status object
                  sendStatus({
                      message: 'Message sent',
                      clear: true
                  });
             // });
          }
      });

      // Handle clear
      socket.on('clear', function(data){
          // Remove all chats from collection
          chat.remove({}, function(){
              // Emit cleared
              socket.emit('cleared');
          });
      });
  });

  })
  .catch(err => console.log(err));
  
//app.get('/', (req, res) => res.send('Hello World'));
// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/auth', auth)

app.use('/api/posts', posts);
app.get('*', (req,res,next) => {
    const indexFile = path.resolve(__dirname + '/social-fe/dist/social-fe/index.html');
    res.sendFile(indexFile);
});  
  

//app.listen(port, () => console.log(`Server running on port ${port}`));

