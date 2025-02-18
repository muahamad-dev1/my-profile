import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import API from "../api/URL";
import { toast } from "react-toastify";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const EditIssueModal = ({ isOpen, onClose, issue, onUpdate }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    issueStatus: "Open",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || "",
        description: issue.description || "",
        imageUrl: issue.imageUrl || "",
        issueStatus: issue.issueStatus || "Open",
      });
    }
  }, [issue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && e.target.classList.contains("fixed")) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const formatDateForStrapi = (date) => {
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // تنسيق الوقت عند إغلاق المشكلة
    const updatedFormData = {
      ...formData,
      closingTime:
        formData.issueStatus === "Closed" ? new Date().toISOString() : null,
    };

    try {
      const res = await fetch(`${API}/issues/${issue.documentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: updatedFormData,
        }),
      });
      console.log(res)

      const response = await res.json();

      if (response.error) {
        toast.error(response.error.message || "حدث خطأ في تحديث المشكلة");
        return;
      }

      toast.success("تم تحديث المشكلة بنجاح");
      onUpdate(response.data);
      onClose();
    } catch (error) {
      toast.error("حدث خطأ في تحديث المشكلة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            } rounded-lg p-6 w-[90vw] max-w-[500px]`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={onClose}
                className={`cursor-pointer ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <X size={24} />
              </button>
              <h2
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                تعديل المشكلة
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className={`block text-right ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  العنوان
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-black"
                  }`}
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-right ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  الوصف
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-black"
                  }`}
                  rows="4"
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-right ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  رابط الصورة
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-black"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-right ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  الحالة
                </label>
                <select
                  name="issueStatus"
                  value={
                    formData.issueStatus === "Open"
                      ? "Open"
                      : formData.issueStatus === "In-progress"
                      ? "In-progress"
                      : "Closed"
                  }
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-black"
                  }`}
                >
                  <option value="Open">مفتوح</option>
                  <option value="In-progress">تحت المعالجة</option>
                  <option value="Closed">مغلقة</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {isLoading ? "جاري التحديث..." : "تحديث"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={`cursor-pointer ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  } px-4 py-2 rounded transition-colors`}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditIssueModal;
