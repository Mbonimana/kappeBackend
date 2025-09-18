const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/databaseConfiguration');
const mainRouter = require('./routes/indexRouting');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
// If you want CORS, uncomment the next line
// const cors = require('cors');
// app.use(cors(corsOptions));

// Routes
app.use("/api_v1", mainRouter);

// Start server
app.listen(port, () => {
  console.log(`The server is running: http://localhost:${port}`);
});
