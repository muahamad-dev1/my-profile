import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});

  // دمج الـ useEffect في واحد لتجنب التداخل
  useEffect(() => {
    const checkAuthAndUser = () => {
      const token = Cookies.get("token");
      const user = Cookies.get("user");

      setIsAuthenticated(!!token);

      if (user) {
        try {
          setCurrentUser(JSON.parse(user));
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          setCurrentUser({});
        }
      }else {
        setCurrentUser({});
      }

      setLoading(false);
    };

    checkAuthAndUser();
  }, []); // تشغيل مرة واحدة فقط عند التحميل

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setIsAuthenticated(false);
    setCurrentUser({});
    window.location.reload();
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    logout,
    loading,
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
