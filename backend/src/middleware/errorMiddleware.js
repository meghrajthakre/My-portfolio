export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  let statusCode = error.status || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = error.message || "Internal server error";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    statusCode = 400;
    message = "Invalid JSON body";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
