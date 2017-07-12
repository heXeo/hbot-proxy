const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
const appPort = 3000;
const authToken = process.env.AUTH_TOKEN;

function authMiddleware (req, res, next) {
  const token = req.header('X-Auth-Token');

  if (token !== authToken) {
    return res.status('403').json({ message: 'Forbidden !' });
  }
  // Not needed for the rest
  delete req.headers['X-Auth-Token'];

  next();
}

app.use(bodyParser.json());

app.use('*', authMiddleware, (req, res) => {
  const headers = Object.assign({}, req.headers, {
    // Need to specify the host, request is not setting it correctly
    host: 'localhost'
  });

  request({
    method: req.method,
    uri: `http://unix:/var/run/docker.sock:${req.originalUrl}`,
    headers: headers,
    body: req.body,
    json: true
  })
  .pipe(res);
});

app.listen(appPort, () => {
  console.log('hbot-proxy started on port %d', appPort);
});
