import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const currentUser = Cookies.get("user");
  const { darkMode } = useTheme();

  const features = [
    {
      title: "تتبع المشكلات",
      description: "قم بإنشاء وإدارة المشكلات بسهولة",
      icon: "🎯",
      link: "/add-issue",
    },
    {
      title: "تعاون مع الآخرين",
      description: "شارك وتفاعل مع مشكلات الآخرين",
      icon: "🤝",
      link: "/issues",
    },
  ];

  // تكوينات الحركة
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 80 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={`min-h-[92vh] overflow-hidden ${
        darkMode ? "text-white bg-gray-900" : "text-gray-800"
      }`}
    >
      {/* Hero Section */}
      <motion.div variants={fadeIn} className="text-center py-12 px-4">
        <motion.h1 variants={scaleIn} className="text-4xl font-bold mb-4">
          مرحباً بك في Issues Tracker
        </motion.h1>
        <motion.p
          variants={fadeIn}
          className={`${
            darkMode ? "text-gray-300" : "text-gray-600"
          } text-xl mb-8`}
        >
          {currentUser
            ? `أهلاً ${
                JSON.parse(currentUser).username
              }، ابدأ بتتبع وإدارة مشاكلك بكفاءة`
            : "نظام متكامل لإدارة وتتبع المشكلات"}
        </motion.p>

        {!currentUser && (
          <motion.div
            variants={fadeIn}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link
              to="/issues"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              عرض المشكلات
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              إنشاء حساب جديد
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              تسجيل الدخول
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="max-w-6xl mx-auto px-4"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: index * 0.2 },
                },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={currentUser ? feature.link : "/login"}
                className={`p-6 rounded-lg block transition duration-300 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50"
                } shadow-lg`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {feature.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
