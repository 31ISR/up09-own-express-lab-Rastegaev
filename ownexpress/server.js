const express = require("express")
const app = express()

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.header('Access-Control-Allow-Credentials', 'true');


    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});
const SECRET = "dfgdgf"
const jwt = require("jsonwebtoken")
app.use(express.json())

const admin = require('./admin-server')
app.use('/api/admin',admin);

const authreglog = require('./authreglog')
app.use('/api/auth',authreglog)


const comm = require('./comment-server')
app.use('/api/comment',comm);

app.listen(3001)