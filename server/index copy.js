/* const express=require('express')
const app=express()
const cors=require('cors')
const { errorHandler } = require('./errorHandler')

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDoc = YAML.load("./api.yaml");

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

const report=require('./routes/report')
app.use("/",report)

const admin=require('./routes/admin')
app.use("/",admin)

const task = require ('./routes/task')
app.use('/api', task);

app.use(errorHandler);

const port = process.env.PORT || 83;
app.listen(port,()=>{
    console.log("listen 4000")
})
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require('path');
const { errorHandler } = require('./errorHandler');

const app = express();
const swaggerJsDoc = YAML.load("./api.yaml");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

const report = require('./routes/report');
app.use("/", report);

const admin = require('./routes/admin');
app.use("/", admin);

const task = require('./routes/task');
app.use('/api', task);

app.use(errorHandler);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle all other routes for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const port = process.env.PORT || 83;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle all other routes for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

