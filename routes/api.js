const express = require("express");
const router = express.Router();

router.use("/task", require("./apis/tasks.js"));
router.use("/goal", require("./apis/goals.js"));
router.use("/habit", require("./apis/habits.js"));
router.use("/routine", require("./apis/routines.js"));

module.exports = router;