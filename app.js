const express = require("express");
const { connectToDb } = require("./config/db");
const logger = require("./middelwares/logger");
const { notFoundHandler, errorHandler } = require("./middelwares/errors");
const dotenv = require("dotenv");
dotenv.config();

const path = require("path");

//connectin to database
connectToDb();

// Init app
const app = express();

// using middlewares
app.use(express.json()); // as express only understand objects not json, we use this middleware
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"images"))); //allow to open images in browser
app.use(logger);

app.set('view engine','ejs');

//Routes
app.use("/api/books", require("./routes/books")); // bookRouter own all endpoints for book operations with /api/books as prefix for all endpoints paths
app.use("/api/authors", require("./routes/authors")); // authorsRouter own all endpoints for authors operations with /api/authors as prefix for all endpoints paths
app.use("/api/auth", require("./routes/auth")); // authRouter own all endpoints for authors operations with /api/auth as prefix for all endpoints paths
app.use("/api/users", require("./routes/users")); //usersRouter own all endpoints for users operations with /api/users as prefix for all endpoints paths
app.use("/password",require("./routes/password"));
app.use("/api/upload",require("./routes/upload"));
//Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

//Running the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode  on port ${PORT}`
  );
});
