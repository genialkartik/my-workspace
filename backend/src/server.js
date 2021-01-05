const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const config = require('./config/key')

// remove crose-site origin problem (if occur)
app.use(cors());
var PORT = process.env.PORT || 2020
// prevent CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json())

// connect to database
mongoose.connect(config.MongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err))

app.use('/', require('./routes/index'))

// access build files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Listening on PORT:  ${PORT}`)
})