import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import API from "../api/URL";
import Cookies from "js-cookie";

const AddIssue = () => {
  const { darkMode } = useTheme();
  const currentUser = Cookies.get("user");
  const [issue, setIssue] = useState({
    title: "",
    description: "",
    issueStatus: "",
    imageUrl: "",
    counter: 0,
    userId: `${JSON.parse(currentUser).id}`,
    username: JSON.parse(currentUser).username,
    locale: "string",
  });

  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    setIssue({ ...issue, [e.target.name]: e.target.value });
    // Clear validation errors when the user starts typing
    setValidationErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!issue.title.trim()) {
      errors.title = "عنوان المشكلة مطلوب";
    }
    if (!issue.description.trim()) {
      errors.description = "وصف المشكلة مطلوب";
    }
    if (
      !issue.issueStatus ||
      !["Open", "In-progress"].includes(issue.issueStatus)
    ) {
      errors.issueStatus = "يجب اختيار حالة المشكلة (مفتوح أو قيد التنفيذ)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setShowModal(true);
  };

  const confirmAddIssue = async () => {
    try {
      const res = await fetch(`${API}/issues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: issue }),
      });

      const response = await res.json();

      if (response.error) {
        setErrorMessage(response.error.message || "حدث خطأ");
        return;
      }

      setSuccessMessage("تمت إضافة المشكلة بنجاح");
      setShowModal(false);
      // Reset form
      setIssue({
        title: "",
        description: "",
        issueStatus: "",
        imageUrl: "",
        counter: 0,
        userId: `${JSON.parse(currentUser).id}`,
        username: JSON.parse(currentUser).username,
        locale: "string",
      });
      setValidationErrors({}); // Clear validation errors
    } catch (error) {
      setErrorMessage("حدث خطأ أثناء إضافة المشكلة");
    }
  };

  return (
    <div
      className={`min-h-[92vh] overflow-hidden flex justify-center items-center ${
        darkMode ? "text-white bg-gray-900" : "text-gray-800"
      }`}
    >
      <div
        className={`p-6 max-w-xl w-full mx-auto rounded-xl shadow-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          إضافة مشكلة جديدة
        </h2>
        {errorMessage && (
          <div
            className="mb-4 p-4 border rounded bg-red-100 border-red-500 text-red-700"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            className="mb-4 p-4 border rounded bg-green-100 border-green-500 text-green-700"
            role="alert"
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">عنوان المشكلة</label>
            <input
              type="text"
              name="title"
              value={issue.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                darkMode ? "bg-gray-700" : "bg-white"
              } ${
                validationErrors.title ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">وصف المشكلة</label>
            <textarea
              name="description"
              value={issue.description}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                darkMode ? "bg-gray-700" : "bg-white"
              } ${
                validationErrors.description
                  ? "border-red-500"
                  : "border-gray-300"
              } min-h-[100px]`}
              required
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">حالة المشكلة</label>
            <select
              name="issueStatus"
              value={issue.issueStatus}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                darkMode ? "bg-gray-700" : "bg-white"
              } ${
                validationErrors.issueStatus
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">اختر حالة</option>
              <option value="Open">مفتوح</option>
              <option value="In-progress">قيد التنفيذ</option>
            </select>
            {validationErrors.issueStatus && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.issueStatus}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">رابط الصورة (اختياري)</label>
            <input
              type="url"
              name="imageUrl"
              value={issue.imageUrl}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                darkMode ? "bg-gray-700" : "bg-white"
              } border-gray-300`}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
          >
            إضافة المشكلة
          </button>
        </form>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 transition-all z-50">
            <div
              className={`p-6 rounded-lg shadow-lg ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              } max-w-md w-full mx-4`}
            >
              <h3 className="text-xl font-bold mb-4 text-center">
                تأكيد الإضافة
              </h3>
              <p className="mb-6 text-center">
                هل أنت متأكد من أنك تريد إضافة هذه المشكلة؟
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmAddIssue}
                  className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
                >
                  تأكيد
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-2 rounded transition duration-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddIssue;
