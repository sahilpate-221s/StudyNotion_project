const express = require("express");
const router = express.Router();
const { getHomeData } = require("../Controller/Home");

router.get("/", getHomeData);

module.exports = router;
