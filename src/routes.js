const express = require('express');
const router = express.Router();
const db = require('./database');
const { register, login, verifyToken } = require('./auth');

// User Authentication Routes
router.post('/register', register);
router.post('/login', login);

// To-Do CRUD Operations
router.post('/todos', verifyToken, (req, res) => {
  const { description, status } = req.body;
  const query = `INSERT INTO todos (user_id, description, status) VALUES (?, ?, ?)`;
  db.run(query, [req.userId, description, status], function (err) {
    if (err) return res.status(500).send('Error adding to-do item');
    res.status(200).send({ id: this.lastID });
  });
});

router.get('/todos', verifyToken, (req, res) => {
  const query = `SELECT * FROM todos WHERE user_id = ?`;
  db.all(query, [req.userId], (err, rows) => {
    if (err) return res.status(500).send('Error fetching to-do items');
    res.status(200).send(rows);
  });
});

router.put('/todos/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { description, status } = req.body;
  const query = `UPDATE todos SET description = ?, status = ? WHERE id = ? AND user_id = ?`;
  db.run(query, [description, status, id, req.userId], function (err) {
    if (err) return res.status(500).send('Error updating to-do item');
    res.status(200).send({ changes: this.changes });
  });
});

router.delete('/todos/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM todos WHERE id = ? AND user_id = ?`;
  db.run(query, [id, req.userId], function (err) {
    if (err) return res.status(500).send('Error deleting to-do item');
    res.status(200).send({ changes: this.changes });
  });
});

module.exports = router;
