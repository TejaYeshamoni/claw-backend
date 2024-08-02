const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Change this to a file path if you want a persistent database

db.serialize(() => {
  // Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // To-Do Items Table
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    description TEXT,
    status TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;
