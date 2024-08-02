const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your_default_secret_key';

const register = (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(query, [username, hashedPassword], function (err) {
    if (err) return res.status(500).send('Error registering user');
    res.status(200).send({ id: this.lastID });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 hours
    res.status(200).send({ auth: true, token: token });
  });
};

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
};

module.exports = { register, login, verifyToken };
