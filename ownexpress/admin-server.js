const express = require('express');
const auth = require("./auth")
const admin = express.Router();
const multer = require('multer');
const db = require("./db")
const bcr = require("bcryptjs")
const SECRET = "dfgdgf"
const jwt = require("jsonwebtoken")
const path = require('path');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: 'img/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + '.webp'); // ← Просто добавляем .webp
    }
});

const upload = multer({ storage: storage });

admin.get("/users", auth, (req, res) => {
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

admin.post('/news', auth, upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "secondaryImage", maxCount: 1 }]), (req, res) => {
    const { nameState, title, excerpt, content } = req.body
    const mainImage = req.files[`mainImage`]?.[0].filename || null
    const secondaryImageName = req.files['secondaryImage']?.[0]?.filename || null;
    console.log(req.body, mainImage, secondaryImageName)
    const stmt = db.prepare(`INSERT INTO News (name, title, excerpt,content,main_image,secondary_image) VALUES (?,?,?,?,?,?)`).run(nameState, title, excerpt, content, mainImage, secondaryImageName);
    const page = `
    <!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${nameState}</title>
  <link rel="stylesheet" href="css/new.css" />
  <link rel="shortcut icon" href="img/favicon.svg" type="image/svg">
</head>

<body>

  <header class="header">
    <div class="container">
      <a href="index.html">
        <div class="logo">Нейро<span>Дайджест</span></div>
      </a>
      <nav>
        <a href="news.html">Новости</a>
        <a href="guides.html">Гайды</a>
        <a href="collections.html">Подборки</a>
        <a href="login.html" style="color:#60a5fa; font-weight:500;">Вход</a>
      </nav>
    </div>
  </header>

  <!-- HERO -->
  <section class="article-hero" style="background: url('img/${mainImage}') center/cover no-repeat;">
    <div class="overlay"></div>
    <div class="container">

      <h1 id="12">${title}</h1>
    </div>
  </section>

  <main class="article">
    <div class="container article-grid">

      <!-- ARTICLE -->
      <article class="content">

        <p class="lead">
         ${excerpt}
        </p>
        <figure class="image-block">
          <img src="img/${secondaryImageName}" alt="Затруднение ИИ перед задачей">
          <figcaption>Источник: Gemini</figcaption>
        </figure>

        <br>
        <p>
        ${content}
        </p>
         <div class="comments-section">
          <h2 class="comments-title">💬 Комментарии</h2>

          <!-- Поле ввода имени и комментария -->
          <div class="comment-form">
            
            <textarea class="comment-text" placeholder="Напишите комментарий..."></textarea>
            <button type="button" class="comment-submit">Отправить</button>
          </div>

          <div class="comments-list" id="commentsContainer">

          </div>
          
        </div>
      </article>
    </div>
  </main>






</div>
</main>
<footer class="footer">
  © 2026 Нейро Дайджест. <br> По вопросам обращаться: maksimrastegaev742@gmail.com
</footer>
<script src="comment.js"></script>
</body>

</html>
    `;
    fs.writeFile(`${nameState}.html`, page, (err) => {
        if (err) {
            console.error(error)
            res.status(500).json({ error: "Somethin went wrong" })
        }
        res.status(200).json({
            success: true
        })
    })
})

admin.get('/news', (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM News`).all()
        res.status(200).json(stmt);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Somethin went wrong" })
    }
})
admin.delete('/news/:id', auth, (req, res) => {
    try {
        const statid = req.params.id
        const stmt = db.prepare("SELECT * FROM News WHERE id = ?").get(statid)

        
        const deleteState = db.prepare("DELETE FROM News WHERE id = ?").run(statid);
        res.status(200).json({ success: true });
        fs.unlinkSync(`./${stmt.name}.html`)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Somethin went wrong" })
    }
})
module.exports = admin
