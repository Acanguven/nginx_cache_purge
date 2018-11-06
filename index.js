const express = require('express');
const md5 = require("md5");
const fs = require('fs');

const app = express();
const port = 3000;
const pass = 'ttt';
const host = '127.0.0.1:10181';

const authorizationMiddleware = (req, res, next) => {
  if(req.query.pass !== pass || !req.query.file){
    res.status(404).end();
  }
  next();
};


app.get('/purge', authorizationMiddleware, (req, res) => {
  const hash = md5(`${host}${req.query.file}`);
  const filePath = `/mobile_cache/${hash.slice(hash.length-1)}/${hash.slice(hash.length-3, hash.length-1)}/${hash}`;

  fs.unlink(filePath, (error) => {
    if (!error) {
      res.status(200).send(`Deleted file: ${req.query.file}`);
    } else {
      res.status(500).send(error);
    }
  })
});

app.listen(port, () => console.log(`Purge app listening on port ${port}!`));
