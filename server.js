const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'pass',
    database: 'movies_db',
  },
  console.log(`Connected to the movies_db database.`)
);

app.get('/api/movies', (req, res) => {
  db.query(`SELECT * FROM movies`, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).end();
    }
    console.log(result);
    res.status(200).json(result);
  });
});

app.post('/api/add-movie', (req, res) => {
  console.log(req.body[0]);
  let isNewMovie = true;

  db.query(`SELECT * FROM movies`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    result.forEach((element) => {
      if (element.movie_name === req.body[0]) {
        isNewMovie = false;
      }
    });
    if (isNewMovie) {
      db.query(
        `INSERT INTO movies (movie_name) VALUES (?)`,
        req.body[0],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(400).end();
          }
          console.log(result);
          res.status(200).json(result);
        }
      );
    } else {
      res.status(400).end();
    }
  });
});

app.post('/api/update-review', (req, res) => {
  let newReviewObj = req.body;
  let movieID = newReviewObj.movie_id;
  let reviewText = newReviewObj.review;

  db.query(
    `INSERT INTO reviews (movie_id, review) VALUES (?,?)`,
    [movieID, reviewText],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).end();
      }
      console.log(result);
      res.status(200).json(result);
    }
  );
});

app.delete('/api/movie/:id', (req, res) => {
  const deleteID = req.params.id;
  db.query(`DELETE FROM movies WHERE id=?`, deleteID, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).end();
    }
    console.log(result);
    res.status(200).json(result);
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
