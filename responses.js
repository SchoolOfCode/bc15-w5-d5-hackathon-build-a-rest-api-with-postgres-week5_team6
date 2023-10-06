// Import the 'pool' object so our helper functions can interact with the PostgreSQL database
import { pool } from "./db/index.js";

export async function getResponses() {
  // Query the database and return all responses

  // Define the SQL query to fetch all responses from the 'responses' table
  const queryText = "SELECT * FROM responses";

  // Use the pool object to send the query to the database
  const result = await pool.query(queryText);

  // The rows property of the result object contains the retrieved records
  return result.rows;
}

export async function getResponseById(id) {
  // Query the database and return the response with a matching id or null

  // Define the SQL query to fetch the responses with the specified id from the 'responses' table
  const queryText = "SELECT * FROM responses WHERE id = $1";

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const result = await pool.query(queryText, [id]);

  // The rows property of the result object contains the retrieved records
  // If a book with the specified id exists, it will be the first element in the rows array
  // If no book exists with the specified id, the rows array will be empty
  return result.rows[0] || null;
}

export async function createResponse(response) {
  // Query the database to create an response and return the newly created response

  // Define the SQL query to fetch the response with the specified id from the 'responses' table
  const queryText = `INSERT INTO responses (first_name, last_name) VALUES ($1, $2) RETURNING *;`;

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const result = await pool.query(queryText, [
    response.first_name,
    response.last_name,
  ]);

  // The rows property of the result object contains the retrieved records
  // If a book with the specified id exists, it will be the first element in the rows array
  // If no book exists with the specified id, the rows array will be empty
  return result.rows[0] || null;
}

export async function updateResponseById(id, updates) {
  // Query the database to update a response and return the newly updated response or null

  // Define the SQL query to fetch the response with the specified id from the 'responses' table
  const querySelectText = "SELECT * FROM responses WHERE id = $1";

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const resultSelect = await pool.query(querySelectText, [id]);

  if (!resultSelect.rows[0] || null) {
    return null;
  }
  //Store result from the querySelectText
  const response = resultSelect.rows[0];
  //
  if (updates.hasOwnProperty("first_name")) {
    response.first_name = updates.first_name;
  }
  if (updates.hasOwnProperty("last_name")) {
    response.last_name = updates.last_name;

    const queryUpdateText = `UPDATE responses SET first_name = $2, last_name = $3 WHERE id = $1 RETURNING *;`;

    // Use the pool object to send the query to the database
    // passing the id as a parameter to prevent SQL injection
    const resultUpdate = await pool.query(queryUpdateText, [
      response.id,
      response.first_name,
      response.last_name,
    ]);

    // The rows property of the result object contains the retrieved records
    // If a response with the specified id exists, it will be the first element in the rows array
    // If no response exists with the specified id, the rows array will be empty
    return resultUpdate.rows[0] || null;
  }
}

export async function deleteResponseById(id) {
  // Query the database to delete an response and return the deleted response or null

  // Define the SQL query to delete the response  with the specified id from the 'responses' table
  const queryText = "DELETE FROM responses WHERE id = $1 RETURNING *";

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const result = await pool.query(queryText, [id]);

  // The rows property of the result object contains the retrieved records

  // If a book with the specified id exists, it will be the first element in the rows array
  // If no book exists with the specified id, the rows array will be empty
  return result.rows[0] || null;
}
