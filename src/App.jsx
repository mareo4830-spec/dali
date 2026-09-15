import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicMenu from './pages/PublicMenu';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicMenu />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
