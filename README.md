# Poetry Texts

This is a quick server that pings a database to populate a text that is sent to a certian number once a day

## PoetryDB

This is a database full of poems. Their docs can be found at http://poetrydb.org/index.html

## Twilio
Texts are sent through `twilio` (via a free trial), more information on twilio can be found at  https://www.twilio.com/ 

## This project was written in Node.js

## Deployment

There is no frontend in this app, just a simple response. It is deployed at:
https://poetry-texts.herokuapp.com/ 

If you hit this endpoint it will send a response of a random poem. 