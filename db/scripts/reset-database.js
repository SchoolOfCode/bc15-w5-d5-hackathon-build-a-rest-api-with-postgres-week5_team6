import { pool } from "../index.js";

async function resetDatabase() {
  try {
    // Drop existing tables if they exist
    await pool.query(`
      DROP TABLE IF EXISTS errors CASCADE;
      DROP TABLE IF EXISTS responses CASCADE;
    `);

    // Create the errors table with a foreign key to the responses table
    await pool.query(`
      CREATE TABLE errors (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        description TEXT NOT NULL,
        workshop VARCHAR(255),
        error_code VARCHAR(255),
        error_message TEXT
      );
    `);

    // Create the responses table
    await pool.query(`
        CREATE TABLE responses (
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          cause TEXT NOT NULL,
          solution TEXT NOT NULL,
          error_id INT REFERENCES errors(id) NOT NULL
        );
      `);

    // Seed the errors table
    await pool.query(`
      INSERT INTO errors (description, workshop, error_code, error_message)
      VALUES
      ('Network Error', 'Workshop A', 'ERR-001', 'Failed to connect to the server.'),
      ('File Not Found', 'Workshop B', 'ERR-002', 'The requested file does not exist.'),
      ('Database Connection Error', 'Workshop C', 'ERR-003', 'Unable to establish a database connection.'),
      ('Permission Denied', 'Workshop A', 'ERR-004', 'You do not have permission to access this resource.');
    `);

    // Seed the responses table
    await pool.query(`
        INSERT INTO responses (cause, solution, error_id)
        VALUES
        ('Invalid input data', 'Please check the data format and try again.', 1),
        ('Network timeout', 'Ensure your internet connection is stable and try again.', 2),
        ('Missing authentication token', 'Log in to your account to access this feature.', 3),
        ('Database server down', 'Contact the system administrator to resolve the issue.', 4);
      `);

    console.log("Database reset successful");
  } catch (error) {
    console.error("Database reset failed: ", error);
  } finally {
    // End the pool
    await pool.end();
  }
}

await resetDatabase();
