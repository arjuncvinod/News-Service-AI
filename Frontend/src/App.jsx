import { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { auth } from "./services/firebase";
import LoginPage from "./pages/Login/index";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard/index";
import Home from "./pages/Home/index";
import OldHome from "./pages/Home/Home";
import NewsViewPage from "./pages/ViewNews";
import AdminDashboard from "./pages/Dashboard/index";
import Category from "./pages/Category";
import "./App.css";
import Loader from "./components/Loader/Loader";
import { LoadContext } from "./Contexts/LoaderContext";
import SubmitPromoContent from "./pages/SubmitPromo";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const { loading, setLoading } = useContext(LoadContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); 
      setLoading(false);
    });

    setLoading(true);

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [setLoading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <div>
        <Toaster position="bottom-center" reverseOrder={false} />
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/home" /> : <RegisterPage />
            }
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/news/:newsTitle"
            element={
              isAuthenticated ? <NewsViewPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
          />
          <Route
            path="/news/category/:cat"
            element={isAuthenticated ? <Category /> : <Navigate to="/login" />}
          />
          <Route path="/submit-promo" element={<SubmitPromoContent />} />
          <Route path="/oldhome" element={<OldHome />} />

          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
