function validateInputs(username, password) {
  if (username === "") {
    return {
      validated: false,
      message: "Please enter username",
    };
  }
  if (password === "") {
    return {
      validated: false,
      message: "Please enter password",
    };
  }
  return {
    validated: true,
  };
}
function login() {
  var errorMessageBox = document.getElementsByClassName("error-message")[0];
  errorMessageBox.innerText = "";
  let username = document.getElementById("name").value;
  let password = document.getElementById("password").value;
  let formValidated = validateInputs(username, password);
  if (formValidated) {
    $.post(
      `${BASE_URL}/api/v1/login`,
      { username: username, password: password },
      (data) => {
        if (data.status === 400) {
          errorMessageBox.innerText = data.message;
          setTimeout(() => {
            errorMessageBox.innerText = "";
          }, 3000);
        } else {
          // alert("Login Successful.");
          localStorage.setItem("username", username);
          window.location.href = "ocr.html";
        }
      }
    );
  } else {
    errorMessageBox.innerText = formValidated.message;
    setTimeout(() => {
      errorMessageBox.innerText = "";
    }, 3000);
  }
}
