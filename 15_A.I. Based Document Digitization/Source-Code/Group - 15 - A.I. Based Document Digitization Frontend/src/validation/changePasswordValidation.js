const Validator = require("validator");
const isEmpty = require("./is-empty").isEmpty;

module.exports = function validateChangePasswordInput(data) {
  let errors = {};

  data.oldpassword = !isEmpty(data.oldpassword) ? data.oldpassword : "";
  data.password1 = !isEmpty(data.password1) ? data.password1 : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.oldpassword)) {
    errors.oldpassword = "old password field is required";
  }

  if (Validator.isEmpty(data.password1)) {
    errors.password1 = "Password field is required";
  }
  if (data.password1 !== data.password2) {
    errors.password2 = "Passwords do not match";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
