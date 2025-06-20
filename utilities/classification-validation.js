const { body, validationResult } = require("express-validator")

const classificationRules = () => {
  return [
    body("classification_name")
    .trim()
    .isAlphanumeric().withMessage("Only letters/numbers allowed.")
    .notEmpty().withMessage("Classification name is required.")
  ]
}

const checkClassificationData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = req.app.locals.nav
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: null,
      errors: errors.array(),
      classification_name: req.body.classification_name
    })
  }
  next()
}

module.exports = { classificationRules, checkClassificationData }
