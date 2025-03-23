const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Fix form handling

// **Serve Static Files (HTML, CSS, JS)**
app.use(express.static(path.join(__dirname)));

// **Database Connection**
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mohan2003.", 
    database: "userAuth"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

// **Signup Route**
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "User already exists!" });
        }
        res.redirect("/login.html"); // Redirect after signup
    });
});

// **Login Route**
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err || result.length === 0) {
            return res.status(401).json({ message: "User not found!" });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password!" });
        }

        // 🔥 Fix: Send success response
        res.status(200).json({ message: "Login successful!", redirect: "/index.html" });
    });
});

// **Serve index.html by default**
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
