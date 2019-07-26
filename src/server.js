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
rule.hour = 18;

var j = schedule.scheduleJob(rule, function(){
    http.get("http://poetry-texts.herokuapp.com/send");

  });

app.get('/send',(req, res) => {
            
    const accountSid = process.env.SID;
    const authToken = process.env.AUTH;
    const client = require('twilio')(accountSid, authToken);
    
        let poem = [];
            http.get('http://poetrydb.org/author', (resp) => {
                let data = '';
        
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });
        
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    let authors = JSON.parse(data)["authors"];
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
       
                                    client.messages
                                        .create({
                                            body: "Author: "+ author+ "\n"+"Title: " + title + "\n" + JSON.stringify(poem),
                                            from: '+18729850386',
                                            to: '+19178822564‬'
                                        }).then(message => console.log(message.sid)); 
                                    res.send("done");
        
                                });
    
                            });
                        });
                    }).on("error", (err) => {
                        console.log("Error: " + err.message);
                    });
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
        
                });
        
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });

    
    });
    app.get('/', (req, res)=>{
        res.send("this is a quick app that sends poems via text message");
    })
    
    setInterval(function() {
        http.get("http://poetry-texts.herokuapp.com/");
      }, 1200000); // every 5 minutes (300000)

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9000;
app.listen(port);

console.log(`listening on: ${port}`);
