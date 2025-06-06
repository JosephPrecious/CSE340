const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")

// Intentional error route
router.get("/trigger-error", errorController.throwError)

module.exports = router
