// عند تحميل الصفحة، سيتم إضافة الحدث عند إرسال النموذج
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // منع إرسال النموذج بالطريقة المعتادة

    // الحصول على البيانات من المدخلات
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // التحقق من اسم المستخدم وكلمة المرور
    if (username === "admin" && password === "admin") {
      // إذا كان اسم المستخدم Admin وكلمة المرور admin
      window.location.href = "admin.html"; // الانتقال إلى صفحة admin.html
    } else {
      // إذا كان أي اسم مستخدم أو كلمة مرور أخرى
      window.location.href = "index.html"; // الانتقال إلى الصفحة الرئيسية index.html
    }
  });
