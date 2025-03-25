const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mohan2003.",
    database: "userAuth"
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL Database");
});

// Signup route
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) throw err;
            
            if (results.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    message: "User already exists!" 
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            db.query(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                [username, email, hashedPassword],
                (err) => {
                    if (err) throw err;
                    res.json({ 
                        success: true,
                        message: "Signup successful!",
                        redirect: "/login.html"
                    });
                }
            );
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error during signup" 
        });
    }
});

// Login route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) throw err;
            
            if (results.length === 0) {
                return res.status(401).json({ 
                    success: false,
                    message: "User not found!" 
                });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                return res.status(401).json({ 
                    success: false,
                    message: "Incorrect password!" 
                });
            }

            res.json({ 
                success: true,
                message: "Login successful!",
                redirect: "/index.html",
                user: { id: user.id, username: user.username }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error during login" 
        });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});