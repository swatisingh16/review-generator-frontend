import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "../components/Login";
import ReviewGenerator from "../components/ReviewGenerator";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../components/Dashboard";
import { Toaster } from "react-hot-toast";

export default function AppRoutes() {
  const [businesses, setBusinesses] = useState([]);

  return (
    <>
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                businesses={businesses}
                setBusinesses={setBusinesses}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:slug"
          element={
            <ReviewGenerator />
          }
        />
      </Routes>
    </>
  );
}
