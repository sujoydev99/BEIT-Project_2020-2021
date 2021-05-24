const Validator = require("validator");
const isEmpty = require("./is-empty").isEmpty;

module.exports = function validateSignUpInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password field is required";
  }
  if (
    !Validator.isEmpty(data.password) &&
    !Validator.isEmpty(data.confirmPassword)
  ) {
    if (data.password !== data.confirmPassword)
      errors.confirmPassword = "Password and confirm password must be the same";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
