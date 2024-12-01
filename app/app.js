const express = require("express");
const app = express();
const appRoutes = require("./route");
const { notFoundHandler, globalErrorHandler } = require("./errors");
const middleware = require("./middleware");
const dbConnect = require("../db/dbConnect");


//routes
app.use(middleware)
app.use(appRoutes);
app.use(notFoundHandler);
app.use(globalErrorHandler);

dbConnect().catch(err => console.log(err));

module.exports = app

