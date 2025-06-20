const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")
const utilities = require("../utilities")

router.get("/", messageController.showContactForm)
router.post("/", messageController.submitMessage)

// Only Admin can see this
router.get("/view", utilities.checkLogin, utilities.checkAccountType, messageController.viewMessages)

module.exports = router
