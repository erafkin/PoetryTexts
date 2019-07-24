import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';



import router from './router';

require('dotenv').config(); // load environment variables


// initialize

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC6552ad565247c77cb8fc1ce3d7d666a1';
const authToken = '6ed462975d302c6fa64a261a84ebc049';
const client = require('twilio')(accountSid, authToken);

setInterval(function() {

    const authors  = http.get('http://poetrydb.org/author');
    const author = authors["authors"][Math.floor(Math.random() * Math.floor(authors["author"].length))];
    const titles= http.get('http://poetrydb.org/author/' + author + '/title');
    const title = [Math.floor(Math.random() * Math.floor(titles.length))]["title"];
    const poem = http.get('http://poetrydb.org/title/' + title)["lines"];

    client.messages
    .create({
        body: poem,
        from: '+18729850386',
        to: '+19178822564‬'
     })
  .then(message => console.log(message.sid));
  }, 86400000); // every 5 minutes (300000)



// START THE SERVER
// =============================================================================
const port = process.env.PORT || 8000;
app.listen(port);

console.log(`listening on: ${port}`);
