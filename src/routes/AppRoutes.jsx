import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "../components/Login";
import ReviewGenerator from "../components/ReviewGenerator";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../components/Dashboard";
import BusinessList from "../components/BusinessList";

export default function AppRoutes() {
  const [businesses, setBusinesses] = useState([]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <Dashboard businesses={businesses} setBusinesses={setBusinesses} />
        }
      />

      <Route
        path="/business-list"
        element={
          <ProtectedRoute>
            <BusinessList businesses={businesses} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review/:businessId"
        element={
          <ProtectedRoute>
            <ReviewGenerator />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
