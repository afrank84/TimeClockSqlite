const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Define the path to the database file
const dbPath = path.join(__dirname, 'timeclock.db');

// Connect to a file-based SQLite database
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database at', dbPath);
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS timeclock (id INTEGER PRIMARY KEY, time TEXT, action TEXT)");
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/clockin', (req, res) => {
    const time = req.body.time;
    db.run(`INSERT INTO timeclock(time, action) VALUES(?, ?)`, [time, 'in'], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.json({ time: time });
    });
});

app.post('/clockout', (req, res) => {
    const time = req.body.time;
    db.run(`INSERT INTO timeclock(time, action) VALUES(?, ?)`, [time, 'out'], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.json({ time: time });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
