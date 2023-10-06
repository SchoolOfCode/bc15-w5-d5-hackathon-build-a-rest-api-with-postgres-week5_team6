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
  const queryText = `INSERT INTO responses (cause, solution, error_id) VALUES ($1, $2, $3) RETURNING *;`;

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const result = await pool.query(queryText, [
    response.cause,
    response.solution,
    response.error_id
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
  if (updates.hasOwnProperty("cause")) {
    response.cause = updates.cause;
  }
  if (updates.hasOwnProperty("solution")) {
    response.solution = updates.solution;
  }
  if (updates.hasOwnProperty("error_id")) {
    response.error_id = updates.error_id;
  }
    const queryUpdateText = `UPDATE responses SET cause = $2, solution = $3, error_id = $4 WHERE id = $1 RETURNING *;`;

    // Use the pool object to send the query to the database
    // passing the id as a parameter to prevent SQL injection
    const resultUpdate = await pool.query(queryUpdateText, [
      response.id,
      response.cause,
      response.solution,
      response.error_id
    ]);

    // The rows property of the result object contains the retrieved records
    // If a response with the specified id exists, it will be the first element in the rows array
    // If no response exists with the specified id, the rows array will be empty
    return resultUpdate.rows[0] || null;
  
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
