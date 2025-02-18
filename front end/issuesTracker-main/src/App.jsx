import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddIssue from "./pages/AddIssue";
import Issues from "./pages/Issues";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function App() {
  const [isUser, setIsUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      setIsUser(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []); // تشغيل مرة واحدة فقط عند التحميل

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastContainer />
          <div dir="rtl">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Auth routes */}
              <Route
                path="/login"
                element={isUser ? <Navigate to="/issues" /> : <Login />}
              />
              <Route
                path="/register"
                element={isUser ? <Navigate to="/issues" /> : <Register />}
              />

              {/* Protected routes */}
              <Route path="/add-issue" element={isUser && <AddIssue />} />
              <Route path="/issues" element={<Issues />} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
