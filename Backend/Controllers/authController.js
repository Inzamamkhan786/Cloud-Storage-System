const pool = require("../Models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// SIGNUP
exports.signup = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // check if user exists
        const existingUser = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        


        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users(name,email,password_hash)
             VALUES($1,$2,$3)
             RETURNING id,name,email`,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// LOGIN
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // create JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};