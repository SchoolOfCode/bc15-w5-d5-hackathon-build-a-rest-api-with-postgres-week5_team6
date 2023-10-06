import e from "express";

export function handleErrors(error, next) {
  if (error.code === "ENOENT") {
    next(createError(500, "File not found"));
  }
  if (error.name === "SyntaxError") {
    next(createError(500, `JSON File Error`));
  }
  next(error);
}

export function createError(statusCode=500, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.status = "error";
  return err;
}

export function createFail(statusCode=500, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.status = "fail";
  return err;
}
