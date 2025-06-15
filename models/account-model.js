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


module.exports = { registerAccount }
