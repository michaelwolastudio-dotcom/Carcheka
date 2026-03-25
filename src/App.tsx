/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./lib/auth";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NewRepairForm from "./components/repair/NewRepairForm";
import HistoryPage from "./pages/HistoryPage";
import VehicleSearch from "./pages/VehicleSearch";
import AuthPages from "./pages/AuthPages";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Search Route */}
            <Route path="/search" element={<div className="min-h-screen bg-slate-50 p-4 md:p-8"><VehicleSearch /></div>} />
            
            {/* Auth Route */}
            <Route path="/auth" element={<AuthPages />} />

            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/new-repair" 
              element={
                <ProtectedRoute allowedRoles={["MECHANIC", "SUPER_ADMIN"]}>
                  <Layout>
                    <NewRepairForm />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <HistoryPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-8 text-center text-slate-500">Profile page coming soon...</div>
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
