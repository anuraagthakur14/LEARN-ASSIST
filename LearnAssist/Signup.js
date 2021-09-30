function validateInputs(username, password, confirmPassword) {
  if (username === "") {
    return {
      validated: false,
      message: "Please enter username",
    };
  }
  if (password === "" || confirmPassword === "") {
    return {
      validated: false,
      message: "Please enter password",
    };
  }
  if (password !== confirmPassword) {
    return {
      validated: false,
      message: "Passwords entered do not match",
    };
  }
  return {
    validated: true,
  };
}
function signup() {
  var errorMessageBox = document.getElementsByClassName("error-message")[0];
  errorMessageBox.innerText = "";
  let username = document.getElementById("name").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirm_password").value;
  var formValidated = validateInputs(username, password, confirmPassword);
  if (formValidated.validated) {
    $.post(
      `${BASE_URL}/api/v1/sign_up`,
      {
        username: username,
        password: password,
      },
      (data) => {
        if (data.status === 500) {
          errorMessageBox.innerText = data.message;
          setTimeout(() => {
            errorMessageBox.innerText = "";
          }, 3000);
        }
        if (data.status === 200) {
          alert("Sign Up successful.");
          window.location.href = "Login.html";
        }
      },
      "json"
    );
  } else {
    errorMessageBox.innerText = formValidated.message;
    setTimeout(() => {
      errorMessageBox.innerText = "";
    }, 3000);
  }
}
