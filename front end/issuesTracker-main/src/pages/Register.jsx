import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTheme } from "../contexts/ThemeContext";
import API from "../api/URL";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
    };

    // التحقق من الاسم
    if (!formData.username) {
      newErrors.username = "الاسم مطلوب";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "يجب أن يكون الاسم 3 أحرف على الأقل";
      isValid = false;
    }

    // التحقق من البريد الإلكتروني
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
      isValid = false;
    }

    // التحقق من كلمة المرور
    // التحقق من كلمة المرور
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "يجب أن تكون كلمة المرور 8 أحرف على الأقل";
      isValid = false;
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };
  const { setIsAuthenticated } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // مسح رسالة الخطأ عند الكتابة
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(res);
      const response = await res.json();
      console.log(JSON.stringify(formData));
      console.log(response);
      if (response.user && response.jwt) {
        Cookies.set("token", response.jwt, { expires: 7 });
        Cookies.set("user", JSON.stringify(response.user), { expires: 7 });

        setIsAuthenticated(true); // تحديث حالة المصادقة

        toast.success("تم تسجيل الدخول بنجاح");

        // الانتقال إلى الصفحة الرئيسية بعد تأخير بسيط
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (response.error) {
        // التعامل مع أخطاء الباك اند
        setError(response.error.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (err) {
      console.log(err);
      setError(err.error?.message || "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-[92vh] px-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`${
          darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-800"
        } shadow-lg rounded-lg p-10 max-w-lg w-full`}
      >
        <h2 className="text-3xl font-bold text-center mb-8">إنشاء حساب جديد</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* الاسم */}
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              الاسم
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="أدخل اسمك الكامل"
              className={`px-4 py-3 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-white border-gray-300"
              } ${formErrors.username ? "border-red-500" : ""}`}
            />
            {formErrors.username && (
              <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
            )}
          </div>

          {/* البريد الإلكتروني */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
              className={`px-4 py-3 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-white border-gray-300"
              } ${formErrors.email ? "border-red-500" : ""}`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* كلمة المرور */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className={`px-4 py-3 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-white border-gray-300"
              } ${formErrors.password ? "border-red-500" : ""}`}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md font-semibold hover:scale-105 transition duration-300 ${
              darkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isLoading ? "جاري التسجيل..." : "تسجيل"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
