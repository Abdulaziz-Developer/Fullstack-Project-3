// في هذا الملف ، قم بإعداد وحدة المستخدم (الطالب) الخاصة بك | in this file, set up your user module

// 1. قم باستيراد مكتبة moongoose | import the mongoose library
const { Schema, model } = require("mongoose");
// 2. قم بتحديد مخطط الطالب | start defining your user schema
const studentSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  birthdate: String,
  city: String,
});
// 3. إنشاء نموذج الطالب | create  the user model
const studentModel = model("student", studentSchema);
// 4. تصدير الوحدة | export the module

module.exports = studentModel;
