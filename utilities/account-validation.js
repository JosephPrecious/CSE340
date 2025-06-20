const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Registration",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
 * Check login data and return errors
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email,
    })
    return
  }
  next()
}

// For account info update
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim().notEmpty().withMessage("Please provide a first name."),
    body("account_lastname")
      .trim().notEmpty().withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .isEmail().withMessage("A valid email is required.")
      .normalizeEmail(),
  ]
}

validate.checkUpdateAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let nav = await utilities.getNav()
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      message: null,
      accountData: { account_firstname, account_lastname, account_email, account_id }
    })
  }
  next()
}

validate.checkPasswordData = async (req, res, next) => {
  const { account_password, account_id } = req.body
  let nav = await utilities.getNav()
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      message: null,
      accountData: { account_id }
    })
  }
  next()
}

validate.checkUpdatedEmailUnique = async (req, res, next) => {
  const { account_email, account_id } = req.body
  const account = await accountModel.getAccountByEmail(account_email)

  if (account && account.account_id != account_id) {
    let nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: "Email already exists. Choose a different one." }],
      message: null,
      accountData: req.body
    })
  }
  next()
}

validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters and include uppercase, lowercase, number, and special character."
      ),
  ]
}

module.exports = validate