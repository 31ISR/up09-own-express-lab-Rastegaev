const express = require("express")
const db = require("./db")
const bcr = require("bcryptjs")
const app = express()
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'img/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + '.webp'); // ← Просто добавляем .webp
    }
});

const upload = multer({ storage: storage });
app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

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
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) return res.status(401)
        .json({ error: "missing auth header" })
    const token = authHeader.split(" ")[1]
    if (!token) return res.status(401).json({ error: "wrong token format" })
    try {
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.error(error)
    }
}

app.post("/api/auth/register", (req, res) => {
    console.log(req.body)
    const { email, username, password, role } = req.body

    try {
        if (!email || !username || !password)
            return res
                .status(400)
                .json({ error: "Не хватает папы" })
        const syncSalt = bcr.genSaltSync(10)
        const hashed = bcr.hashSync(password, syncSalt)
        const query = db.prepare(`INSERT INTO User (username, email, password,role) VALUES (?, ?, ?, ?)`).run(username, email, hashed, role)
        const newUser = db.prepare("SELECT * FROM User WHERE id  = ?").get(query.lastInsertRowid)
        const { password: _, ...safeUser } = newUser
        res.status(201).json(safeUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Что-то пошло не так" })
    }
})

app.post("/api/auth/login", (req, res) => {
    console.log(req.body)

    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "я не вижу че там написано" })
        }
        const user = db.prepare("SELECT * FROM User WHERE email = ?").get(email)
        if (!user) return res.status(401).json({ error: "ты накосячил гдетол" })
        const hashed = bcr.compareSync(password, user.password)
        if (!hashed) return res.status(401).json({ error: "не правильго" })
        const { password: _, ...safeUser } = user
        const token = jwt.sign(safeUser, SECRET, { expiresIn: "24h" })
        return res.status(200).json({ success: true, token, role: user.role, error: null })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Somethin went wrong" })
    }

})
app.get("/api/admin/users", auth, (req, res) => {
    const admin = req.user.role
    try {
        if (admin === "admin") {
            const query = db.prepare("SELECT * FROM User").all()
            res.status(200).json(query);
        } else {
            res.status(403).json({ error: "Ты не админ" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Somethin went wrong" })
    }
})

app.post('/api/admin/news', auth, upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "secondaryImage", maxCount: 1 }]), (req, res) => {
    const { nameState, title, excerpt, content } = req.body
    const mainImage = req.files[`mainImage`]?.[0].filename || null
    const secondaryImageName = req.files['secondaryImage']?.[0]?.filename || null;
    console.log(req.body, mainImage, secondaryImageName)
    const stmt = db.prepare(`INSERT INTO News (name, title, excerpt,content,main_image,secondary_image) VALUES (?,?,?,?,?,?)`).run(nameState, title, excerpt, content, mainImage, secondaryImageName);
    res.status(200).json({
        success: true
    })
})

app.get('/api/admin/news', (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM News`).all()
        res.status(200).json(stmt);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Somethin went wrong" })
    }
})

app.listen(3001)