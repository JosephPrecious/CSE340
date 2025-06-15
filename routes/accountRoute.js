const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route for login page
router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
     "/register",
     regValidate.registationRules(),
     regValidate.checkRegData,
     utilities.handleErrors(accountController.registerAccount)
   )


module.exports = router
