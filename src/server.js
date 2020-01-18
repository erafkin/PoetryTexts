import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';



require('dotenv').config(); // load environment variables
const app = express();


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
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.minute = 0;
rule.hour = 16;

var j = schedule.scheduleJob(rule, function(){
    http.get("http://poetry-texts.herokuapp.com/send");
  });
const numbers = ['+19178822564‬',  '+13126369908', '‭+18025220791‬', '+13106131605‬'];
app.get('/send',(req, res) => {
    let poem = [];
    let authors = ['Anne Bronte', 'Charlotte Bronte', 'Edgar Allan Poe', 'Emily Bronte', 'Emily Dickinson', 'Henry David Thoreau', 'Jane Austen', 'Jonathan Swift', 'Lewis Carroll', 'Mark Twain', 'Oscar Wilde', 'Ralph Waldo Emerson', 'Walt Whitman', 'William Wordsworth'];
    const author = authors[Math.floor(Math.random() * Math.floor(authors.length))];
    console.log("author: "+ author);
    http.get('http://poetrydb.org/author/' + author + '/title', (resp) => {
        let data2 = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data2 += chunk;
        });
        console.log(data2);
        resp.on('end', () => {
            let titles = JSON.parse(data2);
            const title = titles[Math.floor(Math.random() * Math.floor(titles.length))]["title"];
            if(title.includes("(")) title = title.substring(0, title.indexOf("("))
            console.log("title: "+title);
            console.log('http://poetrydb.org/title/' + title);
            http.get('http://poetrydb.org/title/' + title, (resp) => {

                let data3 = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data3 += chunk;
                });
                console.log(data3);
                resp.on('end', () => {
                    poem = JSON.parse(data3)[0]["lines"];
                    if(poem.length > 160){
                        http.get("http://poetry-texts.herokuapp.com/send");
                    }
                    else{
                        const accountSid = process.env.SID;
                        const authToken = process.env.AUTH;
                        const client = require('twilio')(accountSid, authToken);
                        for(let i = 0; i <  numbers.length; i++){
                            client.messages
                            .create({
                                body: "Author: "+ author+ "\n"+"Title: " + title + "\n" + JSON.stringify(poem),
                                from: '+17868286899',
                                to: numbers[i]
                            }).then(message => console.log(message.sid)); 
                        }
                        
                        res.send(poem);
                    }            
                    

                });

            });
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    
    });


    app.get('/', (req, res)=>{
        res.send("this is a quick app that sends poems via text message");

    });

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9000;
app.listen(port);

console.log(`listening on: ${port}`);
