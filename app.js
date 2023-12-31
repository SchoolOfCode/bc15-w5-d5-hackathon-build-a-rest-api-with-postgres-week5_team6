// Import the required modules
import express from "express";
import morgan from "morgan";
import cors from "cors";
// import { jSendSuccess, jSendError } from "./jSend.js";
// import { handleErrors, createError, createFail } from "./handleErrors.js";

// Import responses-related helper functions
import {
  getResponses,
  getResponseById,
  createResponse,
  updateResponseById,
  deleteResponseById,
} from "./responses.js";

// Import error-related helper functions
import {
  getErrors,
  getErrorById,
  createError,
  updateErrorById,
  deleteErrorById,
} from "./errors.js";

// Import error-and-response-related helper functions
import {
  getErrorsAndResponses,
  getErrorAndResponsesById,
  // createError,
  // updateErrorById,
  // deleteErrorById,
} from "./errorsAndResponses.js";

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
  const errors = await getErrors();
  res.status(200).json({ status: "success", data: errors });
});

// Endpoint to retrieve all errors and associated responses
app.get("/errors/responses", async function (req, res) {
  const data = await getErrorsAndResponses();
  res.status(200).json({ status: "success", data: data });
});

// Endpoint to retrieve a specific error by id
app.get("/errors/:id/responses", async function (req, res) {
  const id = req.params.id;
  const error = await getErrorAndResponsesById(id);
  // Assume 404 status if the error is not found
  if (!error) {
    return res
      .status(404)
      .json({ status: "fail", data: { msg: "Response not found" } });
  }
  res.status(200).json({ status: "success", data: error });
});

// Endpoint to retrieve a specific error by id
app.get("/errors/:id", async function (req, res) {
  const id = req.params.id;
  const error = await getErrorById(id);
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
  const error = await createError(data);
  res.status(201).json({ status: "success", data: error });
});

// Endpoint to update a specific error by id
app.patch("/errors/:id", async function (req, res) {
  const id = req.params.id;
  const data = req.body;
  const error = await updateErrorById(id, data);
  // Assume 404 status if the error is not found
  if (!error) {
    return res
      .status(404)
      .json({ status: "fail", data: { msg: "Error not found" } });
  }
  res.status(200).json({ status: "success", data: error });
});

// Endpoint to delete a specific error by id
app.delete("/errors/:id", async function (req, res) {
  const id = req.params.id;
  const error = await deleteErrorById(id);
  // Assume 404 status if the error is not found
  if (!error) {
    return res
      .status(404)
      .json({ status: "fail", data: { msg: "Error not found" } });
  }
  res.status(200).json({ status: "success", data: error });
});

// Responses Route Handlers

// Endpoint to retrieve all responses
app.get("/responses/", async function (req, res) {
  const responses = await getResponses();
  res.status(200).json({ status: "success", data: responses });
});

// Endpoint to retrieve a specific response by id
app.get("/responses/:id", async function (req, res, next) {
  // try {
    const id = req.params.id;
    const response = await getResponseById(id);
    // Assume 404 status if the response is not found
    if (!response) {
      return res
        .status(404)
        .json({ status: "fail", data: { msg: "Response not found" } });
    }
    res.status(200).json({ status: "success", data: response });
  // } catch (err) {
  //   handleErrors(err, next);
  // }
});

// Endpoint to create a new response
app.post("/responses/", async function (req, res) {
  const data = req.body;
  const responses = await createResponse(data);
  res.status(201).json({ status: "success", data: responses });
});

// Endpoint to update a specific response by id
app.patch("/responses/:id", async function (req, res) {
  const id = req.params.id;
  const data = req.body;
  const response = await updateResponseById(id, data);
  // Assume 404 status if the book is not found
  if (!response) {
    return res
      .status(404)
      .json({ status: "fail", data: { msg: "Response not found" } });
  }

  res.status(200).json({ status: "success", data: response });
});

// Endpoint to delete a specific response by id
app.delete("/responses/:id", async function (req, res) {
  const id = req.params.id;
  const response = await deleteResponseById(id);
  // Assume 404 status if the response is not found
  if (!response) {
    return res
      .status(404)
      .json({ status: "fail", data: { msg: "Response not found" } });
  }
  res.status(200).json({ status: "success", data: response });
});

app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});
