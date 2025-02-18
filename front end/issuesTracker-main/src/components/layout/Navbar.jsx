import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Cookies from "js-cookie";
import { FaBars, FaTimes } from "react-icons/fa"; // أيقونات القائمة والإغلاق

const Navbar = () => {
  const { logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const currentUser = Cookies.get("user");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // حالة القائمة

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* الجزء الأيسر: الشعار */}
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl">
              Issue Tracker
            </Link>
          </div>

          {/* الجزء الأيمن: الروابط والأزرار (للكمبيوتر) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/issues"
              className="px-4 py-2 hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              عرض المشاكل
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {currentUser ? (
              <>
                <Link
                  to="/add-issue"
                  className={`p-2 rounded-lg cursor-pointer  ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                >
                  اضافة مشكلة
                </Link>

                <button
                  onClick={logout}
                  className="px-4 py-2 cursor-pointer rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg hover:bg-gray-900 text-black hover:text-white ${
                    darkMode &&
                    `dark:text-white 
dark:hover:bg-gray-700`
                  }`}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  انشاء حساب
                </Link>
              </>
            )}
          </div>

          {/* أيقونة القائمة (للموبايل) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* القائمة المنسدلة (للموبايل) */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-2 pb-4">
              <Link
                to="/issues"
                className="px-4 py-2 hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                عرض المشاكل
              </Link>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 text-left rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? "☀️ الوضع الفاتح" : "🌙 الوضع الداكن"}
              </button>

              {currentUser ? (
                <>
                  <Link
                    to="/add-issue"
                    className="px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    اضافة مشكلة
                  </Link>

                  <button
                    onClick={logout}
                    className="px-4 py-2 text-left rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg hover:bg-gray-900 text-black hover:text-white ${
                      darkMode &&
                      `dark:text-white 
dark:hover:bg-gray-700`
                    }`}
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    انشاء حساب
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
