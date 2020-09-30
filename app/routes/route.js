// في هذا الملف ، قم بإعداد طرق التطبيق الخاصة بك | in this file, set up your application routes
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
// 1. استيراد وحدةالمدرس | import the teacher module
const teacherModel = require("../models/Teacher");
const hashPassword = require("../Helper/Hash");
// 2. استيراد وحدة الطالب | import the student module
const studentModel = require("../models/Student");

// Routes
const setupRoutes = function (app) {
  app.get("/index.html", function (req, res) {
    res.sendFile(__dirname + "/index.html");
  });

  app.get("/teacher/students", async function (req, res) {
    let conditions = {};
    try {
      const thetoken = req.headers.authorization;

      if (!thetoken) {
        res.statusCode = 401;
        res.send("You have no permissions!");
        return;
      }

      const decodedToken = jwt.decode(thetoken);

      console.log(decodedToken);

      const theTeacher = await teacherModel.findById(decodedToken.sub);

      if (!theTeacher) {
        res.statusCode = 401;
        res.send("You have no permissions !");
        return;
      }

      jwt.verify(thetoken, theTeacher.salt);

      if (req.query.name) {
        conditions.name = { $in: [req.query.name] };
      }
      const students = await studentModel.find(conditions);

      res.send(students);
    } catch (error) {
      res.statusCode = 401;
      res.send(error.message);
    }
  });

  // 3. تسجيل مدرس جديد و تخزين بياناته | new teacher sign up
  app.post("/teacher/register", async function (req, res) {
    // const name = req.body.myname;
    // const email = req.body.email2;
    // const password = req.body.password2;
    // const birthdate = req.body.thedate;

    const { name, email, password, birthdate } = req.body;

    const InfoSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      birthdate: Joi.string().required(),
    });
    const validationResult = InfoSchema.validate(req.body);
    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);

      return;
    }
    try {
      const newTeacher = new teacherModel({
        name,
        email,
        password,
        birthdate,
      });
      await newTeacher.save();
      res.send(newTeacher);
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  });

  app.post("/student/register", async function (req, res) {
    const { name, email, birthdate, city } = req.body;
    const InfoSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      city: Joi.string().required(),
      birthdate: Joi.string().required(),
    });
    const validationResult = InfoSchema.validate(req.body);
    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }
    try {
      const newStudent = new studentModel({
        name,
        birthdate,
        city,
        email,
      });
      await newStudent.save();
      res.send(newStudent);
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  });

  // 4. تسجيل دخول مدرس و ارجاع التوكن | teacher login and response with jwt token
  app.post("/teacher/login", async function (req, res) {
    const { email, password } = req.body;

    const teacher = await teacherModel.findOne({ email });

    if (!teacher) {
      res.statusCode = 401;
      res.send("Teacher not found!");
    } else {
      if (teacher.password === hashPassword(password, teacher.salt)) {
        const token = jwt.sign({ sub: teacher._id }, "" + teacher.salt, {
          expiresIn: 30,
        });
        res.send(token);
      } else {
        res.statusCode = 403;
        res.send("Password is Wrong !");
      }
    }
  });
  // 5. إعداد طرق مختلفة | setup the different routes (get, post, put, delete)
  app.delete("/student/id:id", async function (req, res) {
    const { id } = req.params;
    try {
      const student = await studentModel.deleteOne({ _id: id });
      res.send(student);
    } catch (error) {
      res.send(error.message);
    }
  });
};
// Routes
// 3. تصدير الوحدة | export the module
module.exports = setupRoutes;
