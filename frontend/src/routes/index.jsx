import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import MainLayout from '../layouts/MainLayout';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import VehicleDetails from '../pages/VehicleDetails';
import AdminDashboard from '../pages/AdminDashboard';
import AddVehicle from '../pages/AddVehicle';
import EditVehicle from '../pages/EditVehicle';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:id"
          element={
            <ProtectedRoute>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-vehicle"
          element={
            <AdminRoute>
              <AddVehicle />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-vehicle/:id"
          element={
            <AdminRoute>
              <EditVehicle />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
