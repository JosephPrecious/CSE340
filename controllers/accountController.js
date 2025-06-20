const utilities = require("../utilities")
const accountModel = require('../models/account-model')
const jwt = require("jsonwebtoken")
// bcrypt removed
require("dotenv").config()

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

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  const message = req.flash('notice')
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    message: message.length > 0 ? message[0] : null,
  })
}

async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Store plain password (not secure, but you're doing this for dev/school)
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    const message = req.flash('notice')
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      message: message.length > 0 ? message[0] : null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    const message = req.flash('notice')
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      message: message.length > 0 ? message[0] : null
    })
  }
}

async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log("Account data returned from DB:", accountData)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    const match = account_password === accountData.account_password
    if (match) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600000
      })
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "An unexpected error occurred. Please try again.")
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  const message = req.flash('notice')
  const accountData = res.locals.accountData

  res.render("account/management", {
    title: "Account Management",
    nav,
    message: message.length > 0 ? message[0] : null,
    accountData,
    errors: null
  })
}

function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have successfully logged out.")
  res.redirect("/")
}

async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.accountId)
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account",
    nav,
    message: null,
    errors: null,
    accountData
  })
}

async function updateAccountInfo(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (updateResult) {
    const updatedAccount = await accountModel.getAccountById(account_id)
    req.flash("notice", "Account updated successfully.")
    res.locals.accountData = updatedAccount
    res.redirect("/account/")
  } else {
    req.flash("notice", "Update failed. Try again.")
    res.redirect(`/account/update/${account_id}`)
  }
}

async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
  const result = await accountModel.updatePassword(account_id, account_password)

  if (result) {
    const updatedAccount = await accountModel.getAccountById(account_id)
    req.flash("notice", "Password updated successfully.")
    res.locals.accountData = updatedAccount
    res.redirect("/account/")
  } else {
    req.flash("notice", "Password update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  logout,
  buildUpdateAccount,
  updateAccountInfo,
  updatePassword
}
