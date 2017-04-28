"use strict";

const express = require("express");
const router  = express.Router();
const authenticateUser = require("./route-helpers");

module.exports = (knex) => {

  const dbInsert = require("../db/insert-tables")(knex);
  const dbGet = require("../db/query-db")(knex);

  router.get("/", (req, res) => {
    dbGet.getLists().then(data => {
      console.log("query results from getLists function:\n", data); //***Delete after testing
      res.json(data);
    })
    .catch(error => {
      console.error(error);
    });
  });

  router.post("/new", authenticateUser, (req, res) => {
    // *** alter insert function to return list_id
    dbInsert.insertList(req.body.title).then(list_id => {
      res.redirect = ("/lists/" + list_id);
    });
  });

  router.get("/:list_id", (req, res) => {
    // *** need new function to query db for single list?
    dbGet.getList().then(data => {
      let templateVars = {
        username: req.session.username,
        list: data.title, // ***Update function?
        list_id: req.params.list_id
      };
    });
    res.render("map", templateVars);
  });

  router.get("/:list_id/points", (req, res) => {
    dbGet.getPoints(req.params.list_id).then(data => {
      res.json(data);
    });

  });

  return router;
};
