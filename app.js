const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const movies = require('./mock-data/movies.json');
const _ = require('lodash');

app.listen(port, () => {
    console.log(`my server is running at http://localhost:${port}`)
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
/* ---- BELOW ARE APP METHODS ----*/


app.get("/movies/:id", (req, res) => {
  let movieId = req.params["id"];
    if (Number.isNaN(parseInt(movieId, 10))) {
      res.status(400).send("Invalid ID supplied");
    } else {
        let movie = movies.filter((elem) => elem.id == movieId);
        
        if (movie.length) {
            res.status(200).send([
              {
                    title: movie[0].title,
                    author: movie[0].director,
                    release_year: movie[0].release_year,
                  },
            ]);
          } else {
            res.status(404).send("Movie ID not found");
        }
    }
});

app.get('/movies/', (req, res) => {
    if (!req.query.id) {
      res.status(200).json(movies).end()
    } else {
    //res.status(200).send(req.query.title)
    
    let titleQ = {};
    let query = false;
    
    //ADD a 400 response
    // 400 text 'Invalid titleQuery supplied'
    
    req.query.title && (query = true);
    query && (titleQ = movies.find((movie) => movie.title === req.query.title));
    //console.log(`query: ${Object.entries(req.query)}, titleQ: ${titleQ?.title}, query: ${query}`);
    (!_.isEqual(titleQ, undefined) && !_.isEqual(titleQ, {})) ? res.send(titleQ) : res.status(404).send('Your query string returned no results.');
    }
  });

  /* TO DO: Sequencing of the gets prevents full functionality of the URI calls. Need to address sequencing */

  // app.get('/movies/', (req, res) => {
  //     res.status(200).json(movies);
  // });
  
  app.post("/movies", (req, res) => {
    //No error checking yet instituted  
    movies.push(req.body);
    res.status(201).send('Received');
  });
    
app.delete("/movies/:id", (req, res) => {
  let movieId = req.params["id"];
  if (Number.isNaN(parseInt(movieId, 10))) {
    res.status(400).send("Invalid ID supplied");
  } else {
    let movieFound = -1;
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].id == movieId) {
        movieFound = i;
        movies.splice(i, 1);
        res.status(200).end();
      }
    }
    if (!movieFound) {
      res.status(404).send("Movie ID not found");
    }
  }
  res.end();
});

