const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")


// Route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to build the login view
router.get("/login", accountController.buildLogin) 

// Process registration form submission
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

//  Process login form submission
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Logout Route
router.get("/logout", accountController.logout)


// Account management view
router.get("/",utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Display the update view (already added in Task 3)
// GET: Account Update View
router.get("/update/:accountId", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// POST: Update account info
router.post("/update-info", 
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  regValidate.checkUpdatedEmailUnique,
  utilities.handleErrors(accountController.updateAccountInfo)
)

// POST: Update password
router.post("/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router