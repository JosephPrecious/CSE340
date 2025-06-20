const utilities = require("../utilities/")
const messageModel = require("../models/message-model")

async function showContactForm(req, res) {
  const nav = await utilities.getNav()
  res.render("contact/form", { title: "Contact Us", nav, message: null, errors: null })
}

async function submitMessage(req, res) {
  const nav = await utilities.getNav()
  const { sender_name, sender_email, subject, message } = req.body

  try {
    await messageModel.addMessage(sender_name, sender_email, subject, message)
    req.flash("notice", "Your message has been sent!")
    res.redirect("/")
  } catch (error) {
    res.render("contact/form", {
      title: "Contact Us",
      nav,
      message: "Failed to send message. Try again.",
      errors: [{ msg: error.message }]
    })
  }
}

async function viewMessages(req, res) {
  const nav = await utilities.getNav()
  const result = await messageModel.getAllMessages()
  res.render("contact/messages", { title: "Messages", nav, messages: result.rows })
}

module.exports = { showContactForm, submitMessage, viewMessages }
