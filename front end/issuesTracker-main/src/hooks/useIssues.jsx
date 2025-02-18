import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const useIssues = (API) => {
  const currentUser = Cookies.get("user");
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchIssues = useCallback(
    async (statusFilter) => {
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
    },
    [API, currentUser]
  );

  useEffect(() => {
    fetchIssues(filter);
  }, [filter, fetchIssues]);

  return {
    issues,
    isLoading,
    filter,
    setFilter,
    fetchIssues,
  };
};
