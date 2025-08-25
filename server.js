// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// SQLite database setup
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT,
        password TEXT
      )`
    );
  }
});


let currentUser = null;

// ---------- ROUTES ----------

// Test route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express + SQLite!" });
});

// Signup route
app.post("/api/signup", (req, res) => {
  const { username, email, password } = req.body;
  db.run(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, password],
    function (err) {
      if (err) {
        console.error("Signup error:", err.message);
        return res.json({ ok: false, error: err.message });
      }
      console.log("User registered:", username);
      res.json({ ok: true });
    }
  );
});

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    `SELECT * FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, row) => {
      if (err || !row) {
        console.error("Login failed:", err ? err.message : "No match");
        return res.status(401).json({ ok: false });
      }
      currentUser = {
        ...row,
        isLogged: true,
        time: new Date().toISOString(),
      };
      console.log("Login success:", username);
      res.json({ ok: true });
    }
  );
});

// Logout route
app.post("/api/logout", (req, res) => {
  console.log("git User logged out:", currentUser?.username || "unknown");
  currentUser = null;
  res.json({ ok: true });
});

// Profile route
app.get("/api/profile", (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ ok: false });
  }
  res.json({ ok: true, user: currentUser });
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
