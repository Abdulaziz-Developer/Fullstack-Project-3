// في هذا الملف ، قم بإعداد وحدة المستخدم (المدرس) الخاصة بك | in this file, set up your user module

// 1. قم باستيراد مكتبة moongoose | import the mongoose library
const { Schema, model } = require("mongoose");
const hashPassword = require("../Hash");
const shortId = require("shortid");
// 2. قم بتحديد مخطط المدرس | start defining your user schema
const teacherSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  birthdate: String,
  salt: String,
});

// تخزين كلمة السر بعد عمل الهاش
teacherSchema.pre("save", function (next) {
  if (!this.salt) {
    this.salt = shortId.generate();
  }
  if (this.password) {
    this.password = hashPassword(this.password, this.salt);
  }
  next();
});

// 3. إنشاء نموذج المدرس | create  the user model
const teacherModel = model("teacher", teacherSchema);

// 4. تصدير الوحدة | export the module
module.exports = teacherModel;
