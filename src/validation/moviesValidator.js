const { check } = require("express-validator");

/* title, rating, awards, release_date */
module.exports = [ 
  check("title").notEmpty().withMessage("title  campo requerido"),
  check("rating").notEmpty().withMessage("rating campo requerido"),
  check("awards").notEmpty().withMessage("awards requerido"),
  check("release_date").notEmpty().withMessage("release campo requerido"),
]