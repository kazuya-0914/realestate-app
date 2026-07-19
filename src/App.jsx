import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import PropertiesPage from "./pages/PropertiesPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/properties"
            element={
              <ProtectedRoute>
                <PropertiesPage />
              </ProtectedRoute>
            }
          />
          {/* ルート直下は物件一覧へ。未ログインならProtectedRouteがログイン画面に転送する */}
          <Route path="/" element={<Navigate to="/properties" replace />} />
          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
