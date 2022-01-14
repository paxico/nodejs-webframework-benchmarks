import express from 'express';
import assert from 'assert';
import bodyParser from 'body-parser';
import { getSalesSummary, getSalesPersonByFirstName } from '../functions.js';

assert(process.env.PORT, 'missing env var PORT');

const { PORT } = process.env;

const app = express();

app.use(bodyParser.json());

app.post('/people', (req, res) => {
  const firstName = req.body.firstName;

  getSalesPersonByFirstName(firstName)
    .then((result) => {
      res.send(result);
    })
    .catch((e) => {
      res.status(500);
      res.send(e);
    });
});

app.get('/:firstname', (req, res) => {
  const firstName = req.params.firstname;

  getSalesSummary(firstName)
    .then((result) => {
      res.send(result);
    })
    .catch((e) => {
      res.status(500);
      res.send(e);
    });
});

app.get('/text', (_, res) => {
  res.send({ message: 'hello world', time: new Date().getTime() });
});

app.listen(PORT);