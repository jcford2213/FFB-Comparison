// Import Dependencies
const express = require('express');

// Initialize express app
const app = express();

// Global variables
const port = 5000 // Port the server listens on


// Listening on port 5000
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});