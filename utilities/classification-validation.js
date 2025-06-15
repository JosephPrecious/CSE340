const { body, validationResult } = require("express-validator")

const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 }).withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/).withMessage("No spaces or special characters allowed.")
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
