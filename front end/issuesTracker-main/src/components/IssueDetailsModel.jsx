import React, { useEffect } from "react";
import { format, formatDistance } from "date-fns";
import { ar } from "date-fns/locale";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const IssueDetailsModal = ({ isOpen, onClose, issue }) => {
  if (!isOpen || !issue) return null;
  const { darkMode } = useTheme();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800";
      case "In Progress":
      case "In-progress":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Open":
        return "مفتوح";
      case "In Progress":
      case "In-progress":
        return "تحت المعالجة";
      case "Closed":
        return "مغلقة";
      default:
        return status;
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        opacity: 0,
        animation: "fadeIn 0.3s ease forwards",
      }}
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
    >
      <div
        style={{
          opacity: 0,
          transform: "translateY(20px)",
          animation: "slideIn 0.3s ease forwards",
        }}
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideIn {
              from { 
                opacity: 0;
                transform: translateY(20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <button
              onClick={onClose}
              className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 hover:rotate-90"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                issue.issueStatus
              )}`}
            >
              {getStatusText(issue.issueStatus)}
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
                alt={issue.username}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {issue.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {issue.username}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  تاريخ النشر:{" "}
                  {format(new Date(issue.createdAt), "MM/dd/yyyy hh:mm a", {
                    locale: ar,
                  })}
                </p>
                   {issue.closingTime && (
                                    <span
                                      className={`text-sm ${
                                        darkMode ? "text-gray-400" : "text-gray-600"
                                      }`}
                                    >
                                      تاريخ الاغلاق:{" "}
                                      {format(
                                        new Date(issue.closingTime),
                                        "MM/dd/yyyy hh:mm a",
                                        {
                                          locale: ar,
                                        }
                                      )}
                                    </span>
                                  )}
              </div>
            </div>

            {issue?.imageUrl && issue.imageUrl.trim() !== "" && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-right">
                  صورة المشكلة
                </h2>
                <img
                  src={issue.imageUrl}
                  alt="صورة المشكلة"
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 text-right">
                  وصف المشكلة
                </h3>
                <p className="text-gray-900 dark:text-white text-right">
                  {issue.description}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 text-right">
                  عدد الأصوات
                </h3>
                <p className="text-gray-900 dark:text-white text-right text-2xl font-bold">
                  {issue.counter}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsModal;
