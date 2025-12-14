import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import ReviewGenerator from "../components/ReviewGenerator";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/review"
        element={
          <ProtectedRoute>
            <ReviewGenerator />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
