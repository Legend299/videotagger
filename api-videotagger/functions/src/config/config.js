require('dotenv').config();
module.exports = {
  port: process.env.PORT,
  host: process.env.HOST || 'localhost',
  java_api: process.env.JAVA_API
};
