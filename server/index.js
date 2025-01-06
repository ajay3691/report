const express = require('express');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require('path');
const morgan = require('morgan');
const { errorHandler } = require('./errorHandler');

const app = express();
const swaggerJsDoc = YAML.load("./api.yaml");
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan('tiny'));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

const report = require('./routes/report');
app.use("/", report);

const admin = require('./routes/admin');
app.use("/", admin);

const task = require('./routes/task');
app.use('/api', task);

app.use(errorHandler);

/* // Serve static files from the React app in frontend/build
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Handle all other routes for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
 */
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle all other routes for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Set up the server to listen on port 83 (or a custom port if defined in the environment variables)
const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});;
