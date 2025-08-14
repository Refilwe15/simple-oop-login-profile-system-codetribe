const db = new sqlite3.Database(path.join(__dirname, "database.sqlite"));
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    createdAt TEXT,
    loggedIn INTEGER DEFAULT 0
  )`);
});
