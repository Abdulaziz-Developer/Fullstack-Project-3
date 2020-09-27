//  استيراد المكتبات المطلوبة | import the required libraries
const express = require("express");
const mongoose = require("mongoose");
const setupRoutes = require("./routes/route");
const bodyParser = require("body-parser");
//  تأكد من تنزيل الوحدات المطلوبة | make sure to download the required modules
const start = async function () {
  try {
    await mongoose
      .connect("mongodb://localhost/SchoolSystem", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(function () {
        console.log("Let us Create an App");
        const app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        console.log("Let us Create a Routes");
        setupRoutes(app);
        console.log("Server Started on port 3000");
        app.listen(3000);
      });
  } catch (error) {
    console.error(error);
  }
};
// لا تنسى تحديد وظيفة الخادم | don't forget to define the server function that listens to requests
start();
