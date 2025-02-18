import React, { useEffect, useState } from "react";
import API from "../api/URL";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useTheme } from "../contexts/ThemeContext";
import { format, formatDistance } from "date-fns";
import { ar } from "date-fns/locale";
import { Edit, Trash } from "lucide-react";
import IssueDetailsModal from "../components/IssueDetailsModel";
import EditIssueModal from "../components/EditIssueModel";

const DeleteModal = ({ isOpen, onClose, onConfirm, issue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[90vw] max-w-[400px]">
        <h2 className="text-xl text-right font-bold mb-4 dark:text-white">
          تأكيد الحذف
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-right mb-2">
          هل أنت متأكد من أنك تريد حذف هذه المشكلة؟
        </p>
        {issue && (
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-4">
            <p className="font-semibold text-right dark:text-white">
              {issue.title}
            </p>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => onConfirm(issue.documentId)}
            className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            حذف
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 cursor-pointer hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

const Issues = () => {
  const [userVotes, setUserVotes] = useState(() => {
    const storedVotes = localStorage.getItem("userVotedIds");
    return storedVotes ? JSON.parse(storedVotes) : [];
  });

  const { darkMode } = useTheme();
  const currentUser = Cookies.get("user");
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    fetchIssues(filter);
  }, [filter]);

  const fetchIssues = async (statusFilter) => {
    setIsLoading(true);
    try {
      let url = `${API}/issues?sort[0]=createdAt:desc`;
      if (statusFilter === "MyIssues") {
        const userId = currentUser ? JSON.parse(currentUser).id : null;
        if (userId) {
          url += `&filters[userId][$eq]=${userId}`;
        }
      } else if (statusFilter !== "All") {
        url += `&filters[issueStatus][$eq]=${statusFilter}`;
      }

      const res = await fetch(url);
      const response = await res.json();
      if (response.error) {
        toast.error(response.error.message || "حدث خطأ");
        return;
      }
      setIssues(response.data || []);
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (id, counter, documentId) => {
    try {
      const updatedVotes = [...userVotes, documentId];
      setUserVotes(updatedVotes);
      localStorage.setItem("userVotedIds", JSON.stringify(updatedVotes));

      const res = await fetch(`${API}/issues/${documentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { counter: counter + 1 },
        }),
      });

      const response = await res.json();
      if (response.error) {
        toast.error(response.error.message || "حدث خطأ");
        return;
      }

      setIssues((prevIssues) => {
        const newIssues = [...prevIssues];
        const index = newIssues.findIndex(
          (issue) => issue.documentId === documentId
        );
        if (index !== -1) {
          newIssues[index] = {
            ...newIssues[index],
            counter: newIssues[index].counter + 1,
          };
        }
        return newIssues;
      });

      toast.success("تم التصويت بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء التصويت");
    }
  };

  const handleUnVote = async (id, counter, documentId) => {
    try {
      const updatedVotes = userVotes.filter(
        (votedId) => votedId !== documentId
      );
      setUserVotes(updatedVotes);
      localStorage.setItem("userVotedIds", JSON.stringify(updatedVotes));

      const res = await fetch(`${API}/issues/${documentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { counter: counter - 1 },
        }),
      });

      const response = await res.json();
      if (response.error) {
        toast.error(response.error.message || "حدث خطأ");
        return;
      }

      setIssues((prevIssues) => {
        const newIssues = [...prevIssues];
        const index = newIssues.findIndex(
          (issue) => issue.documentId === documentId
        );
        if (index !== -1) {
          newIssues[index] = {
            ...newIssues[index],
            counter: newIssues[index].counter - 1,
          };
        }
        return newIssues;
      });

      toast.success("تم إلغاء التصويت بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء إلغاء التصويت");
    }
  };

  const openDeleteModal = (issue) => {
    setIssueToDelete(issue);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIssueToDelete(null);
  };

  const handleDeleteIssue = async (documentId) => {
    try {
      const res = await fetch(`${API}/issues/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (res.status === 204 || res.ok) {
        toast.success("تم حذف المشكلة بنجاح");
        await fetchIssues(filter);
        closeDeleteModal();
      } else {
        toast.error("حدث خطأ غير متوقع، لا يوجد رد مناسب من الخادم.");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ في حذف المشكلة");
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

  const handleShowIssueDetails = async (documentId) => {
    try {
      const res = await fetch(`${API}/issues/${documentId}`);
      const response = await res.json();
      if (response.error) {
        toast.error(response.error.message || "حدث خطأ");
        return;
      }
      setSelectedIssue(response.data);
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب بيانات المشكلة");
    }
  };
const [issueToEdit, setIssueToEdit] = useState(null);
  const handleCardClick = (e, documentId) => {
    // Get all the interactive elements that should not trigger the modal
    const isButton = e.target.closest("button");
    const isEditIcon = e.target.closest(".bg-blue-100");
    const isTrashIcon = e.target.closest(".bg-red-100");

    // If the click was on or inside any of these elements, don't open the modal
    if (isButton || isEditIcon || isTrashIcon) {
      return;
    }

    // Otherwise, proceed with showing issue details
    handleShowIssueDetails(documentId);
  };
console.log(issues)
  return (
    <div
      className={`min-h-screen justify-center flex items-start w-[100vw] p-6 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteIssue}
        issue={issueToDelete}
        darkMode={darkMode}
      />

      <IssueDetailsModal
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        issue={selectedIssue}
        darkMode={darkMode}
      />
      <EditIssueModal
        isOpen={!!issueToEdit}
        onClose={() => setIssueToEdit(null)}
        issue={issueToEdit}
        onUpdate={(updatedIssue) => {
          setIssues((prevIssues) =>
            prevIssues.map((issue) =>
              issue.documentId === updatedIssue.documentId
                ? updatedIssue
                : issue
            )
          );
        }}
      />
      <div className="max-w-[1520px] w-full md:px-20 px-5 max-[360px]:px-0 mx-auto">
        <div className="flex justify-between max-sm:flex-col max-sm:gap-5 items-center mb-8">
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            إدارة المشكلات
          </h1>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? "dark:text-white dark:bg-gray-800 dark:border-gray-700"
                : "border-gray-300 bg-white"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="All">جميع المشكلات</option>
            <option value="Open">مفتوحة</option>
            <option value="In Progress">تحت المعالجة</option>
            {currentUser && <option value="MyIssues">مشكلاتي</option>}
            <option value="Closed">مغلقة</option>
          </select>
        </div>

        <div
          className={`w-full ${
            isLoading || issues.length === 0
              ? "flex justify-center items-center"
              : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          }`}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : issues && issues.length > 0 ? (
            issues.map((issue) => (
              <div
                key={issue.id}
                onClick={(e) => handleCardClick(e, issue.documentId)}
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-lg w-full overflow-hidden cursor-pointer`}
              >
                <div className="p-6">
                  <div className="flex flex-col space-y-4">
                    {/* Header Section with Title and Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start justify-between w-full">
                      {/* User Info and Title */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <img
                          src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
                          alt={issue.username}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h2
                            className={`text-xl font-semibold line-clamp-2 break-words ${
                              darkMode ? "text-white" : "text-gray-900"
                            } mb-1`}
                          >
                            {issue.title}
                          </h2>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {issue.username}
                          </p>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col max-sm:flex-row gap-2 items-end flex-shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(
                            issue.issueStatus
                          )}`}
                        >
                          {getStatusText(issue.issueStatus)}
                        </span>

                        {issue.userId ==
                          (currentUser && JSON.parse(currentUser).id) && (
                          <div className="flex gap-2">
                            <span
                              onClick={() => setIssueToEdit(issue)}
                              className="px-3 py-1 rounded-lg cursor-pointer text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                              <Edit className="w-4 h-4" />
                            </span>
                            <span
                              onClick={() => openDeleteModal(issue)}
                              className="px-3 py-1 rounded-lg cursor-pointer text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
                            >
                              <Trash className="w-4 h-4" />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-2">
                      <p
                        className={`line-clamp-3 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        الوصف:
                        <br />
                        {issue.description}
                      </p>
                    </div>

                    {/* Dates Section */}
                    <div className="space-y-1">
                      <span
                        className={`block text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        تاريخ النشر:{" "}
                        {format(
                          new Date(issue.createdAt),
                          "MM/dd/yyyy hh:mm a",
                          {
                            locale: ar,
                          }
                        )}
                      </span>
                      {issue.closingTime && (
                        <span
                          className={`block text-sm ${
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

                    {/* Footer Section */}
                    <div
                      className={`flex items-center justify-between p-3 ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      } rounded-lg mt-4`}
                    >
                      <div className="flex-shrink-0">
                        <span
                          dir="rtl"
                          className={`text-xl font-bold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                    {!currentUser && (
                      <span className="text-lg">عدد التصويت:</span>
                    )}      {issue.counter}
                        </span>
                      </div>
                      {currentUser && (
                        <button
                          onClick={() => {
                            if (userVotes.includes(issue.documentId)) {
                              handleUnVote(
                                issue.id,
                                issue.counter,
                                issue.documentId
                              );
                            } else {
                              handleVote(
                                issue.id,
                                issue.counter,
                                issue.documentId
                              );
                            }
                          }}
                          className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                            userVotes.includes(issue.documentId)
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          {userVotes.includes(issue.documentId)
                            ? "إلغاء التصويت"
                            : "تصويت"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h2
              className={`text-center text-4xl ${
                darkMode ? "text-white" : "text-gray-900"
              } font-bold`}
            >
              لا يوجد مشكلات
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Issues;
