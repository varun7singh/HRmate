const { Router } = require("express");
const express = require("express");
const routes = express.Router();
const { protect } = require("../middleware/protect.js");

const {
  addJob,
  getJobs,
  getJob,
  saveJobList
} = require("../controllers/list.controllers.js");

routes.post("/addJob", protect, addJob);
routes.get("/getJobs", protect, getJobs);
routes.get("/:id/getJob", protect, getJob);
routes.post("/:id/saveJobList", protect, saveJobList);


module.exports = routes;
