const Database = require('better-sqlite3')

const db = new Database('database.db') // создаёт файл автоматически

// Создаём таблицы при первом запуске

db.prepare(`
    CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT UNIQUE NOT NULL,
        password  TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT "user",
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
        
`).run()

db.prepare(`
    CREATE TABLE IF NOT EXISTS News (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        main_image TEXT,
        secondary_image TEXT
    ) 
`).run()

db.prepare(`
    CREATE TABLE IF NOT EXISTS Comment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nameState TEXT NOT NULL,
        userId INTEGER NOT NULL,
        userName TEXT NOT NULL,
        textComment TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES User (id) ON DELETE CASCADE,
        FOREIGN KEY (userName) REFERENCES User (username) ON DELETE CASCADE
    ) 
`).run()

module.exports = db