const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
     try {
       const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
       return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
     } catch (error) {
       return error.message
     }
   }

 async function addClassification(name) {
  try {
    return await pool.query(
    "INSERT INTO classification (classification_name) VALUES ($1)",
      [name]
    );
  } catch (err) {
    console.error("addClassification error:", err);
    return null;
  }
}

async function addInventoryItem(classId, make, model, year, price, mileage, image, thumbnail) {
  try {
    return await pool.query(
      `INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_price, inv_mileage, inv_image, inv_thumbnail)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [classId, make, model, year, price, mileage, image, thumbnail]
    );
  } catch (err) {
    console.error("addInventoryItem error:", err);
    return null;
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `
    const result = await pool.query(sql, [firstname, lastname, email, account_id])
    return result.rowCount
  } catch (error) {
    throw new Error("Update account failed: " + error.message)
  }
}


async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;
    `
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result.rowCount
  } catch (error) {
    throw new Error("Password update failed: " + error.message)
  }
}


async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1"
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  }catch (error) {
    console.error("getAccountByEmail error:", error.message)
    return null
  }  
}

module.exports = {
  registerAccount,
  addClassification,
  addInventoryItem,
  getAccountByEmail,
  updateAccount,
  getAccountById,
updatePassword
}
