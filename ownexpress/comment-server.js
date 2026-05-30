const express = require('express');
const auth = require("./auth")
const db = require("./db")
const bcr = require("bcryptjs")
const SECRET = "dfgdgf"
const jwt = require("jsonwebtoken")
const comm = express.Router();

comm.post('/', auth, (req, res) => {
    try {
        const { textComment, nameState } = req.body;
        const userId = req.user.id;
        
        const userName = req.user.username;
        console.log(req.body,userId,userName)
        const stmt = db.prepare(`INSERT INTO Comment(nameState,userId,userName,textComment) VALUES(?,?,?,?)`).run(nameState, userId, userName, textComment);
        res.status(201).json(stmt);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Somethin went wrong" })
    }
})
comm.get('/:slug', auth, (req, res) => {
    try {
        const {slug} = req.params
        const stmt = db.prepare(`SELECT * FROM Comment WHERE nameState = ?`).all(slug);
        res.status(201).json(stmt);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Somethin went wrong" })
    }
})
module.exports = comm