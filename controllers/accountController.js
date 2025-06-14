const utilities = require("../utilities")
const accountModel = require('../models/account-model')


/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  const message = req.flash('notice')
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    message: message.length > 0 ? message[0] : null,
  })
}


/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  const message = req.flash('notice')
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    message: message.length > 0 ? message[0] : null, // ensure message is defined
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    const message = req.flash('notice')  // <-- retrieve flash message here
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      message: message.length > 0 ? message[0] : null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    const message = req.flash('notice')  // <-- retrieve flash message here too
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      message: message.length > 0 ? message[0] : null
    })
  }
}


module.exports = {
  buildLogin,
  buildRegister,registerAccount
}