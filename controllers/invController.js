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


module.exports = invCont