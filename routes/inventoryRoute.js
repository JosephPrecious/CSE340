// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Classification View - Public
router.get("/type/:classificationId", invController.buildByClassificationId)

// Vehicle Detail View - Public
router.get("/detail/:inv_id", invController.buildByVehicleId)

// Error Test - Public (development only)
router.get("/error/test", invController.testError)

// Management View - PROTECTED
router.get(
  "/", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
)

// Add Classification - PROTECTED
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add Inventory - PROTECTED
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
)
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router