const AWS = require("aws-sdk");

// Configure AWS S3 using your credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

// Create S3 service object
const s3 = new AWS.S3();
module.exports = s3;