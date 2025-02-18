import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTheme } from "../contexts/ThemeContext";
import API from "../api/URL";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const { setIsAuthenticated } = useAuth();
  
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    identifier: "", // سيتم استخدامه للبريد الإلكتروني
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    identifier: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      identifier: "",
      password: "",
    };

    // التحقق من البريد الإلكتروني
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.identifier) {
      newErrors.identifier = "البريد الإلكتروني مطلوب";
      isValid = false;
    } else if (!emailRegex.test(formData.identifier)) {
      newErrors.identifier = "البريد الإلكتروني غير صحيح";
      isValid = false;
    }

    // التحقق من كلمة المرور
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

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

  if (!validateForm()) return; // التحقق من صحة النموذج

  setIsLoading(true); // تفعيل التحميل
  setError(null); // إعادة تعيين الخطأ السابق

  try {
    const res = await fetch(`${API}/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // التأكد من استلام الاستجابة بشكل صحيح
    const response = await res.json();

    if (response.user && response.jwt) {
      // حفظ البيانات في الكوكيز وتحديث حالة المصادقة
      Cookies.set("token", response.jwt, { expires: 7 });
      Cookies.set("user", JSON.stringify(response.user), { expires: 7 });

      setIsAuthenticated(true); // تحديث حالة المصادقة

      toast.success("تم تسجيل الدخول بنجاح");

      // الانتقال إلى الصفحة الرئيسية بعد تأخير بسيط
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else if (response.error) {
      // إذا كانت هناك أخطاء في الاستجابة
      if (response.error.message === "Invalid identifier or password") {
       return setError("خطأ في البريد الإلكتروني أو كلمة المرور");
      }
      setError(
        response.error.message || "خطأ في البريد الإلكتروني أو كلمة المرور"
      );
    }
  } catch (err) {
    console.log(err)
    setError("حدث خطأ أثناء تسجيل الدخول");
  } finally {
    setIsLoading(false); // إيقاف التحميل
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
        <h2 className="text-3xl font-bold text-center mb-8">تسجيل الدخول</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* البريد الإلكتروني */}
          <div className="mb-6">
            <label
              htmlFor="identifier"
              className="block text-sm font-medium mb-2"
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="example@example.com"
              className={`px-4 py-3 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-white border-gray-300"
              } ${formErrors.identifier ? "border-red-500" : ""}`}
            />
            {formErrors.identifier && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.identifier}
              </p>
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
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
