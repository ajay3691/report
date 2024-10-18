const express=require('express')
const morgan=require('morgan')
const app=express()
const cors=require('cors')
const { errorHandler } = require('./errorHandler')


const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDoc = YAML.load("./api.yaml");

const sequelize = require ('./db/sequelize.js');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(morgan('tiny'));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

const report=require('./routes/report')
app.use("/",report)

const task = require ('./routes/task')
app.use('/api', task);

const admin=require('./routes/admin')
app.use("/",admin)

app.use(errorHandler);

app.get('/', (req, resp) => {
    resp.send("hello express");
  });

app.listen(4001,()=>{
    console.log("listen 4000")
})
/* sequelize.authenticate()
    .then(async () => {
        console.log('Database connection has been established successfully.');
        // Get the name of the connected database
        const dbName = sequelize.config.database;
        console.log('Connected to database:', dbName);

        // Get the names of all tables in the connected database
        const tableNames = await sequelize.getQueryInterface().showAllTables();
        console.log('Tables in the database:', tableNames.join(', '));

        // Start the Express server
        /* app.listen(PORT, HOST, () => {
            console.log(`Server running on http://${HOST}:${PORT}`);
        }); 
        app.listen(4001, () => {
            console.log('Server is running on port 4000');
          });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });
 */


