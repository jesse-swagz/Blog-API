const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const objectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide firstname."],
    unique: false,
  },

  lastname: {
    type: String,
    required: [true, "Please provide lastname."],
    unique: false,
  },

  email: {
    type: String,
    required: [true, "Please provide Email."],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 8,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
  // this.passwordConfirm = undefined
  next();
});
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
