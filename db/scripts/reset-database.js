import { pool } from "../index.js";

async function resetDatabase() {
  try {
    // Drop existing tables if they exist
    await pool.query(`
      DROP TABLE IF EXISTS books CASCADE;
      DROP TABLE IF EXISTS authors CASCADE;
    `);

    // Create the authors table
    await pool.query(`
      CREATE TABLE authors (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL
      );
    `);

    // Create the books table with a foreign key to the authors table
    await pool.query(`
      CREATE TABLE books (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        published_date DATE,
        author_id INT REFERENCES authors(id)
      );
    `);

    // Seed the authors table
    await pool.query(`
      INSERT INTO authors (first_name, last_name)
      VALUES 
        ('George', 'Orwell'),
        ('J.K.', 'Rowling'),
        ('J.R.R.', 'Tolkien'),
        ('Agatha', 'Christie');
    `);

    // Seed the books table
    await pool.query(`
      INSERT INTO books (title, published_date, author_id)
      VALUES 
        ('1984', '1949-06-08', 1),
        ('Animal Farm', '1945-08-17', 1),
        ('Harry Potter and the Philosopher''s Stone', '1997-06-26', 2),
        ('Harry Potter and the Chamber of Secrets', '1998-07-02', 2),
        ('The Hobbit', '1937-09-21', 3),
        ('The Lord of the Rings: The Fellowship of the Ring', '1954-07-29', 3),
        ('The Lord of the Rings: The Two Towers', '1954-11-11', 3),
        ('The Lord of the Rings: The Return of the King', '1955-10-20', 3),
        ('And Then There Were None', '1939-11-06', 4),
        ('Murder on the Orient Express', '1934-01-01', 4);
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
