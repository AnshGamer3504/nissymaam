// Required Modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

// Initialize Express App
const app = express();
const port = 8645;  // Use the port you prefer, in this case, 8645

// Initialize SQLite database
const db = new sqlite3.Database('./messages.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create the messages table if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, message TEXT)', (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Messages table ready.');
  }
});

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the homepage with the form
app.get('/', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY id DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching messages:', err.message);
      res.status(500).send('Error fetching messages');
    } else {
      let messagesHtml = '<ul>';
      rows.forEach(row => {
        messagesHtml += `<li><strong>${row.name}:</strong> ${row.message}</li>`;
      });
      messagesHtml += '</ul>';

      res.send(`
  <html>
    <head>
      <title>Birthday Messages</title>
      <!-- Google Font for Playwrite VN -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Playwrite+VN&display=swap" rel="stylesheet">
      <link rel="icon" type="image/png" href="favicon.png">


      <style>
        body {
          font-family: 'Playwrite VN', serif;
          background-color: thistle;
          color: #333;
          text-align: center;
          padding: 20px;
        }
        h1 {
          color: #e91e63;
          font-size: 36px;
        }
        form {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: inline-block;
          margin-bottom: 30px;
        }
        input, textarea {
          width: 300px;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        button {
          padding: 10px 20px;
          border: none;
          background-color: #4CAF50;
          color: white;
          font-size: 18px;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          background-color: #fff;
          margin: 10px 0;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Custom font class */
        .playwrite-vn-uniquifier {
          font-family: "Playwrite VN", serif;
          font-optical-sizing: auto;
          font-weight: 400;
          font-style: normal;
        }
      </style>
    </head>
    <body>
<center>
      <h1>Happy Birthday Nissy Ma'am!</h1>
<img src="https://i.postimg.cc/BbNyqZ15/maam.png" alt="Ma'am's Picture" height="300">
<p>"You are the best teacher ever!" ~ Everyone</p>
      <form action="/submit" method="POST">
        <label for="name">Your Name:</label>
        <input type="text" id="name" name="name" required><br>
        <label for="message">Your Message:</label>
        <textarea id="message" name="message" required></textarea><br>
        <button type="submit">Submit Message</button>
      </form>
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
    }
  });
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, message } = req.body;

  // Insert the submitted message into the database
  db.run('INSERT INTO messages (name, message) VALUES (?, ?)', [name, message], (err) => {
    if (err) {
      console.error('Error inserting message:', err.message);
      res.status(500).send('Error submitting message');
    } else {
      res.redirect('/');  // Redirect to the homepage to show the updated list
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

