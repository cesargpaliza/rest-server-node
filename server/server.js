require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
//MIDLEWARE
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

app.get('/', function (req, res) {
  res.json('Hello World')
})

mongoose.connect(process.env.URL_DB, 
                { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
                (err, res) => {
                    if(err) throw err;
                    console.log('Base de datos online');
});




app.listen(process.env.PORT , () => {
    console.log("Escuchando puerto 3000");
})