let signupForm = document.querySelector("#signupForm");
let username = document.querySelector("#username");
let email = document.querySelector("#email");
let password = document.querySelector("#password");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // التحقق من صحة الحقول
  if (username.value === "" || email.value === "" || password.value === "") {
    alert("Please fill in all the fields");
  } else {
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email.value)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.value.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // حفظ البيانات في localStorage
    localStorage.setItem("username", username.value);
    localStorage.setItem("email", email.value);
    localStorage.setItem("password", password.value);

    // إعادة تعيين الحقول بعد الحفظ
    signupForm.reset();

    setTimeout(() => {
      window.location = "./index.html";
    }, 1000);
  }
});
