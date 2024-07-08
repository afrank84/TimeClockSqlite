const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Import path module
const app = express();
const port = 3000;

let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
    db.run("CREATE TABLE timeclock (id INTEGER PRIMARY KEY, time TEXT, action TEXT)");
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

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
