const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const gapps = require('./playstore.js');

app.listen(8080, () => {
  console.log('server Started on Port 8080');
});

app.get('/apps', (req, res) => {
  let { sort, genres } = req.query;
  let results = gapps;
  if (genres) {
    if (
      !['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(
        genres.toLowerCase()
      )
    ) {
      return res.status(400).send(
        // eslint-disable-next-line quotes
        "genres value must either be 'Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'"
      );
    } else {
      genres = genres.toLowerCase();
      genres = genres[0].toUpperCase() + genres.slice(1);
      results = results.filter(app => app['Genres'] === genres);
    }
  }
  if (sort) {
    if (!['rating', 'app'].includes(sort.toLowerCase())) {
      return res.status(400).send('sort value must either be rating or app');
    } else {
      if (sort.toLowerCase() === 'app') {
        sort = sort.toLowerCase();
        sort = sort[0].toUpperCase() + sort.slice(1); //makes the first letter capital
        results = results.sort((a, b) => {
          return a[sort].toLowerCase() > b[sort].toLowerCase()
            ? 1
            : a[sort].toLowerCase() < b[sort].toLowerCase()
            ? -1
            : 0;
        });
      } else {
        sort = parseFloat(sort);
        results = results.sort((a, b) => b.Rating - a.Rating);
      }
    }
  }

  res.json(results);
});
