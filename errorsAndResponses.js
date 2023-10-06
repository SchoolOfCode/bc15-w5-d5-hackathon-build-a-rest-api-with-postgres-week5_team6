// Import the 'pool' object so our helper functions can interact with the PostgreSQL database
import { pool } from "./db/index.js";

export async function getErrorsAndResponses() {
  // Query the database and return all errors

  // Define the SQL query to fetch all errors from the 'errors' table
  const queryText = "SELECT * FROM errors, responses WHERE errors.id = responses.error_id";

  // Use the pool object to send the query to the database
  const result = await pool.query(queryText);

  // The rows property of the result object contains the retrieved records
  return result.rows;
}

export async function getErrorAndResponsesById(id) {
  // Query the database and return the error with a matching id or null

  // Define the SQL query to fetch the error with the specified id from the 'errors' table
  const queryText = "SELECT * FROM errors, responses WHERE errors.id = responses.error_id AND errors.id = $1";

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const result = await pool.query(queryText, [id]);

  // The rows property of the result object contains the retrieved records
  // If a error with the specified id exists, it will be the first element in the rows array
  // If no error exists with the specified id, the rows array will be empty
  return result.rows[0] || null;
}

export async function createError(error) {
  // Query the database to create a error and return the newly created error

  // Define the SQL query to fetch the error with the specified id from the 'errors' table
  const queryText = `INSERT INTO errors (description, workshop, error_code, error_message)
                     VALUES ($1, $2, $3, $4) RETURNING *;`;

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const result = await pool.query(queryText, [
    error.description,
     error.workshop,
     error.error_code, 
     error.error_message
  ]);

  // The rows property of the result object contains the retrieved records
  // If an error with the specified id exists, it will be the first element in the rows array
  // If no error exists with the specified id, the rows array will be empty
  return result.rows[0] || null;
}

export async function updateErrorById(id, updates) {
  // Query the database to update a error and return the newly updated error or null

  // Define the SQL query to fetch the error with the specified id from the 'errors' table
  const querySelectText = "SELECT * FROM errors WHERE id = $1";

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const resultSelect = await pool.query(querySelectText, [id]);

  if (!resultSelect.rows[0] || null) {
    return null;
  }
  //Store result from the querySelectText
  const error = resultSelect.rows[0];
  //
  // error.description = updates.title ?? error.title;
  if (updates.hasOwnProperty("description")) {
    error.description = updates.description;
  }
  if (updates.hasOwnProperty("workshop")) {
    error.workshop = updates.workshop;
  }
  if (updates.hasOwnProperty("error_code")) {
    error.error_code = updates.error_code;
  }
  if (updates.hasOwnProperty("error_messsage")) {
    error.error_messsage = updates.error_messsage;
  }



  // Define the SQL query to fetch the error with the specified id from the 'errors' table
  const queryUpdateText = `UPDATE errors SET description = $2, workshop = $3, error_code = $4, error_message = $5 WHERE id = $1 RETURNING *;`;

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const resultUpdate = await pool.query(queryUpdateText, [
    error.id,
    error.description,
    error.workshop,
    error.error_code,
    error.error_message
  ]);

  // The rows property of the result object contains the retrieved records
  // If a error with the specified id exists, it will be the first element in the rows array
  // If no error exists with the specified id, the rows array will be empty
  return resultUpdate.rows[0] || null;
}

export async function deleteErrorById(id) {
  // Query the database to delete a error and return the deleted error or null

  // Define the SQL query to delete the error with the specified id from the 'errors' table
  const queryText = "DELETE FROM errors WHERE id = $1 RETURNING *";

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const result = await pool.query(queryText, [id]);

  // The rows property of the result object contains the retrieved records

  // If a error with the specified id exists, it will be the first element in the rows array
  // If no error exists with the specified id, the rows array will be empty
  return result.rows[0] || null;
}
