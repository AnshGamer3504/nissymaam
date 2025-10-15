const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// SQLite database path
const dbPath = path.join(__dirname, 'messages.db'); // Your existing DB
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error opening database:', err.message);
  else console.log('Connected to the SQLite database.');
});

// Serve static files if any
app.use(express.static('public'));

// Serve homepage with messages
app.get('/', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY id DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching messages:', err.message);
      return res.status(500).send('Error fetching messages');
    }

    let messagesHtml = '';
    rows.forEach(row => {
      messagesHtml += `<li><strong>${row.name}:</strong> ${row.message}</li>`;
    });

    res.send(`
<html>
<head>
<title>Birthday Messages</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playwrite+VN&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="favicon.png">
<style>
body { font-family: 'Playwrite VN', serif; background-color: thistle; color: #333; text-align: center; padding: 20px; }
h1 { color: #e91e63; font-size: 36px; }
ul { list-style-type: none; padding: 0; }
li { background-color: #fff; margin: 10px 0; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
</style>
</head>
<body>
<center>
<h1>Happy Birthday Nissy Ma'am!</h1>
<img src="https://i.postimg.cc/BbNyqZ15/maam.png" alt="Ma'am's Picture" height="300">
<p>"You are the best teacher ever!" ~ Everyone</p>

<h2>Messages:</h2>
<ul>
${messagesHtml}
</ul>

<h3>Edits we found on Instagram</h3>
<iframe width="321" height="570" src="https://www.youtube.com/embed/RCPnJjHvwHA" title="maam insta" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</center>
</body>
</html>
    `);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
