'use strict';

const express = require('express');
const router  = express.Router();
const authenticateUser = require('./route-helpers');

module.exports = (knex) => {

  const dbInsert = require('../db/insert-tables')(knex);
  const dbGet = require('../db/query-db')(knex);

  router.get('/', (req, res) => {
    dbGet.getFavoriteCounts().then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error(error);
    });
  });

  router.post('/new', authenticateUser, (req, res) => {
    console.log(req.body);

    dbInsert.insertList(req.body.title, req.session.user_id, req.body.private).then(data => {
      if (req.body.private === "true") {
        return dbInsert.insertAccess(data[0], req.session.user_id);
      } else {
        return data;
      }
    }).then(data => {
      res.json({ id: data[0] });
    });
  });

  router.get('/:list_id/access', (req, res) => {
    dbGet.getAccess(req.params.list_id).then(data => {
      res.json(data);
    });
  });

  router.get('/:list_id/points', (req, res) => {
    dbGet.getPoints(req.params.list_id).then(data => {
      res.json(data);
    });
  });

  router.get('/:list_id', (req, res) => {
    dbGet.getOneList(req.params.list_id).then(data => {
      let templateVars = {
        username: req.session.username,
        list: data[0].title,
        list_id: req.params.list_id,
        private: data[0].private
      };
      res.render('map', templateVars);
    });
  });

  return router;
};
