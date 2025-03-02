//error handler

const notFoundHandler = (req, res, next) => {
  const error = new Error("Path not found");
  error.status = 404;
  next(error);
};

//global error handler

const globalErrorHandler = (error, req, res, next) => {
  console.log("Error", error);

  if (error.status) {
    return res.status(error.status).json({
      message: error.message || "Something went wrong",
    });
  }

  res.status(500).json({
    message: error.message || "Error occured",
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
