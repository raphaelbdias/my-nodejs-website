const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database (database.db in project root)
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Error connecting to SQLite database:", err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create "users" table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phone TEXT
)`, (err) => {
    if (err) {
        console.error("Error creating users table:", err.message);
    } else {
        console.log('Users table ready.');
    }
});

// API endpoint for signing up 
app.post('/api/signup', async (req, res) => {
    const { username, email, password, firstName, lastName, phone } = req.body;
    // Dummy validation
    if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    
    // Insert new user into the database
    const sql = `INSERT INTO users (username, email, password, firstName, lastName, phone)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [username, email, password, firstName, lastName, phone || null], function(err) {
        if (err) {
            // If email already exists, UNIQUE constraint will trigger an error.
            return res.status(400).json({ success: false, message: err.message });
        }
        res.json({ success: true, userId: this.lastID });
    });
});

// API endpoint for login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ success: false, message: "Missing email or password." });
    }
    
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(sql, [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (row) {
            // Using firstName and lastName to form realName
            const realName = `${row.firstName} ${row.lastName}`;
            res.json({ success: true, realName });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials." });
        }
    });
});

// Existing endpoint to proxy modulelistnames using the real API call
app.get('/api/systemnames', async (req, res) => {
    try {
        const response = await fetch("http://localhost:8000/api/system?key=modulelistnames");
        if (!response.ok) {
            throw new Error("API error: " + response.statusText);
        }
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// Fallback for other routes, if needed:
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});