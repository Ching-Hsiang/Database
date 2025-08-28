// backend/db.js
require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  //port: parseInt(process.env.DB_PORT || '1433'), // 可自訂 port，預設 1433
  options: {
    encrypt: true,                // Azure SQL 必須啟用加密
    trustServerCertificate: true, // 若為開發用 localhost 可啟用
    enableArithAbort: true,       // 建議加這一行（官方文件建議）
  },
};

module.exports = config;
