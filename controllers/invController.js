const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getVehicleById(inv_id)
    const nav = await utilities.getNav()
    const vehicleView = await utilities.buildVehicleDetail(data)
    const vehicleTitle = `${data.inv_year} ${data.inv_make} ${data.inv_model}`

    res.render("./inventory/detail", {
      title: vehicleTitle,
      nav,
      vehicleView
    })
  } catch (error) {
    next(error)
  }
}

invCont.testError = async function (req, res, next) {
  try {
    throw new Error("This is a simulated server error.")
  } catch (err) {
    next(err)
  }
}

invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    message: req.flash("message"),
  })
}

invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    message: req.flash("message"),
    errors: null,
  })
}

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    // ✅ Set success message using "notice" (preferred for consistency)
    req.flash("notice", `The ${classification_name} classification was added.`)

    // ✅ Rebuild nav to include the new classification
    const nav = await utilities.getNav()

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      message: req.flash("notice"), // display the flash message
    })
  } else {
    // ⚠️ If it fails, show the form again with the message
    const nav = await utilities.getNav()
    req.flash("notice", "Failed to add classification.")
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("notice"),
      errors: [{ msg: "Failed to insert classification." }],
    })
  }
}


invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    message: req.flash("message"),
    errors: null,
  })
}

invCont.addInventory = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  // Insert data into the DB
  const insertResult = await invModel.addInventoryItem({
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  })

  const nav = await utilities.getNav()

  if (insertResult) {
    req.flash("notice", "Inventory item successfully added.")
    
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      message: req.flash("notice"),
    })
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: "Failed to add inventory item.",
      errors: [{ msg: "Failed to insert inventory item." }],
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
  }
}



module.exports = invCont