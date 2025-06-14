// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:inv_id", invController.buildByVehicleId);

router.get("/error/test", invController.testError);

router.get(
     "/", 
     utilities.handleErrors(invController.buildManagement)
   );

// Management View
router.get("/", utilities.handleErrors(invController.buildManagementView)) 

// Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add Inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)


module.exports = router;