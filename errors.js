// Import the 'pool' object so our helper functions can interact with the PostgreSQL database
import { pool } from "./db/index.js";

export async function getErrors() {
  // Query the database and return all errors

  // Define the SQL query to fetch all errors from the 'errors' table
  const queryText = "SELECT * FROM errors";

  // Use the pool object to send the query to the database
  const result = await pool.query(queryText);

  // The rows property of the result object contains the retrieved records
  return result.rows;
}

export async function getErrorById(id) {
  // Query the database and return the error with a matching id or null

  // Define the SQL query to fetch the error with the specified id from the 'errors' table
  const queryText = "SELECT * FROM errors WHERE id = $1";

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
  const queryText = `INSERT INTO errors (title, published_date, author_id) VALUES ($1, $2, $3) RETURNING *;`;

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const result = await pool.query(queryText, [
    error.title,
    error.published_date,
    error.author_id,
  ]);

  // The rows property of the result object contains the retrieved records
  // If a error with the specified id exists, it will be the first element in the rows array
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
  // error.title = updates.title ?? error.title;
  if (updates.hasOwnProperty("title")) {
    error.title = updates.title;
  }
  if (updates.hasOwnProperty("published_date")) {
    error.published_date = updates.published_date;
  }
  if (updates.hasOwnProperty("author_id")) {
    error.author_id = updates.author_id;
  }



  // Define the SQL query to fetch the error with the specified id from the 'errors' table
  const queryUpdateText = `UPDATE errors SET title = $2, published_date = $3, author_id = $4 WHERE id = $1 RETURNING *;`;

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const resultUpdate = await pool.query(queryUpdateText, [
    error.id,
    error.title,
    error.published_date,
    error.author_id,
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
