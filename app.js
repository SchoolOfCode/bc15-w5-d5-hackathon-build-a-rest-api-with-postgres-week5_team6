// Import the required modules
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { jSendSuccess, jSendError } from "./jSend.js";
import { handleErrors, createError, createFail } from "./handleErrors.js";

// Import error-related helper functions
import {
  getResponses,
  getResponseById,
  createResponse,
  updateResponseById,
  deleteResponseById,
} from "./errors.js";

// Import book-related helper functions
import {
  getErrors,
  getErrorById,
  createError,
  updateErrorById,
  deleteErrorById,
} from "./books.js";

// Initialize the express app
const app = express();
// Retrieve the port number from environment variables
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);

// Middleware
app.use(morgan("dev")); // Morgan is used for logging HTTP requests to the console in a developer-friendly format
app.use(express.json()); // express.json() middleware is used to parse incoming JSON requests

// error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Use the provided status code or default to 500
  res.status(statusCode).json(jSendError(err));
};

// Response Route Handlers

// Endpoint to retrieve all errors
app.get("/errors/", async function (req, res) {
  const errors = await getResponses();
  res.status(200).json({ status: "success", data: errors });
});

// Endpoint to retrieve a specific error by id
app.get("/errors/:id", async function (req, res) {
  const id = req.params.id;
  const error = await getResponseById(id);
  // Assume 404 status if the error is not found
  if (!error) {
    return res
      .status(404)
      .json({ status: "fail", data: { msg: "Response not found" } });
  }
  res.status(200).json({ status: "success", data: error });
});

// Endpoint to create a new error
app.post("/errors/", async function (req, res) {
  const data = req.body;
  const error = await createResponse(data);
  res.status(201).json({ status: "success", data: error });
});

// Endpoint to update a specific error by id
app.patch("/errors/:id", async function (req, res) {
  const id = req.params.id;
  const data = req.body;
  const error = await updateResponseById(id, data);
  // Assume 404 status if the error is not found
  if (!error) {
    return res
      .status(404)
      .json({ status: "fail", data: { msg: "Response not found" } });
  }
  res.status(200).json({ status: "success", data: error });
});

// Endpoint to delete a specific error by id
app.delete("/errors/:id", async function (req, res) {
  const id = req.params.id;
  const error = await deleteResponseById(id);
  // Assume 404 status if the error is not found
  if (!error) {
    return res
      .status(404)
      .json({ status: "fail", data: { msg: "Response not found" } });
  }
  res.status(200).json({ status: "success", data: error });
});

// Error Route Handlers

// Endpoint to retrieve all books
app.get("/books/", async function (req, res) {
  const books = await getErrors();
  res.status(200).json({ status: "success", data: books });
});

// Endpoint to retrieve a specific book by id
app.get("/books/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const book = await getErrorById(id);
    // Assume 404 status if the book is not found
    if (!book) {
      return res
        .status(404)
        .json({ status: "fail", data: { msg: "Error not found" } });
    }
    res.status(200).json({ status: "success", data: book });
  } catch (error) {
    handleErrors(error, next);
  }
});

// Endpoint to create a new book
app.post("/books/", async function (req, res) {
  const data = req.body;
  const book = await createError(data);
  res.status(201).json({ status: "success", data: book });
});

// Endpoint to update a specific book by id
app.patch("/books/:id", async function (req, res) {
  const id = req.params.id;
  const data = req.body;
  const book = await updateErrorById(id, data);
  // Assume 404 status if the book is not found
  if (!book) {
    return res
      .status(404)
      .json({ status: "fail", data: { msg: "Error not found" } });
  }

  res.status(200).json({ status: "success", data: book });
});

// Endpoint to delete a specific book by id
app.delete("/books/:id", async function (req, res) {
  const id = req.params.id;
  const book = await deleteErrorById(id);
  // Assume 404 status if the book is not found
  if (!book) {
    return res
      .status(404)
      .json({ status: "fail", data: { msg: "Error not found" } });
  }
  res.status(200).json({ status: "success", data: book });
});

app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});
