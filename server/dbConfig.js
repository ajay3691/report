const mysql = require("mysql2");
require('dotenv').config();

const reportPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const attendancePool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE1,
});

const connection = reportPool.promise();
const attendanceConnection = attendancePool.promise();

connection.getConnection()
  .then((connection) => {
    console.log("Connected to report database successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to report database:", err);
  });

attendanceConnection.getConnection()
  .then((connection) => {
    console.log("Connected to attendance_register database successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to attendance_register database:", err);
  });

module.exports = {
  connection,
  attendanceConnection,
};

