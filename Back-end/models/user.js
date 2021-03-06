const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const {projectSchema} = require("./emrProject");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  createdAt: { type: Date, default: Date.now },
  projects: [projectSchema],
  favorites:[{type:mongoose.Schema.Types.ObjectId, ref:'Project'}],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name },
    config.get("Key")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
}

function validateProjects(data) {
  const schema = Joi.object({
  projects: Joi.array().min(1).required(),
  });

  return schema.validate(data);
}



exports.User = User;
exports.validate = validateUser;
exports.validateProjects = validateProjects;