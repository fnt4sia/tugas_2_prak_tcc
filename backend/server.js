const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3009;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',      
    password: '',      
    database: 'prak_cc'
});

db.connect(err => {
    if (err) {
        console.error('MySQL Connection Failed:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

app.post('/notes', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" });
    }

    const sql = 'INSERT INTO notes (title, description) VALUES (?, ?)';
    db.query(sql, [title, description], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, title, description });
    });
});

app.get('/notes', (req, res) => {
    const sql = 'SELECT * FROM notes';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.put('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const { title, description } = req.body;

    const sql = 'UPDATE notes SET title = ?, description = ? WHERE id = ?';
    db.query(sql, [title, description, noteId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Note not found" });
        res.json({ id: noteId, title, description });
    });
});

app.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;

    const sql = 'DELETE FROM notes WHERE id = ?';
    db.query(sql, [noteId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Note not found" });
        res.json({ message: "Note deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});