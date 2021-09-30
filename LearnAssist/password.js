function validatePassword(e) {
  var password = document.getElementById("password"),
    confirm_password = document.getElementById("confirm_password");
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
    return false;
  } else {
    confirm_password.setCustomValidity("");
    return true;
  }
  e.preventDefault();
}

// password.onchange = validatePassword;
// confirm_password.onkeyup = validatePassword;
