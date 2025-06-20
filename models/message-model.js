const pool = require("../database/")

async function addMessage(sender_name, sender_email, subject, message) {
  return pool.query(
    `INSERT INTO messages (sender_name, sender_email, subject, message)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [sender_name, sender_email, subject, message]
  )
}

async function getAllMessages() {
  return pool.query(`SELECT * FROM messages ORDER BY submitted_on DESC`)
}

module.exports = { addMessage, getAllMessages }
