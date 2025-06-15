const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invValidate = {}

invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlphanumeric()
      .withMessage("Classification name must contain only letters and numbers.")
      .isLength({ min: 1 })
      .withMessage("Classification name is required."),
  ]
}

invValidate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await require("../utilities").getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: null,
      errors: errors.array(),
    })
    return
  }
  next()
}

invValidate.inventoryRules = () => {
     return [
       body("classification_id")
         .isInt({ min: 1 })
         .withMessage("Please select a valid classification."),
       body("inv_make")
         .trim()
         .isLength({ min: 1 })
         .withMessage("Make is required."),
       body("inv_model")
         .trim()
         .isLength({ min: 1 })
         .withMessage("Model is required."),
       body("inv_year")
         .isInt({ min: 1900, max: 2099 })
         .withMessage("Year must be a valid 4-digit year."),
       body("inv_description")
         .trim()
         .isLength({ min: 1 })
         .withMessage("Description is required."),
       body("inv_image")
         .trim()
         .isLength({ min: 1 })
         .withMessage("Image path is required."),
       body("inv_thumbnail")
         .trim()
         .isLength({ min: 1 })
         .withMessage("Thumbnail path is required."),
       body("inv_price")
         .isFloat({ min: 0 })
         .withMessage("Price must be a valid number."),
       body("inv_miles")
         .isInt({ min: 0 })
         .withMessage("Miles must be a valid number."),
       body("inv_color")
         .trim()
         .isLength({ min: 1 })
         .withMessage("Color is required."),
     ]
   }
   
   invValidate.checkInventoryData = async (req, res, next) => {
     const { classification_id, ...vehicleData } = req.body
     const errors = validationResult(req)
     const classificationList = await require("../utilities").buildClassificationList(classification_id)
     const nav = await require("../utilities").getNav()
   
     if (!errors.isEmpty()) {
       res.render("inventory/add-inventory", {
         title: "Add Inventory",
         nav,
         classificationList,
         errors: errors.array(),
         ...vehicleData,
       })
       return
     }
   
     next()
   }
   

module.exports = invValidate
