import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddBookPage from './pages/admin/AddBookPage';
import EditBookPage from './pages/admin/EditBookPage';
import Breadcrumbs from './components/Breadcrumbs';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <Breadcrumbs />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<BookList />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="add" element={<AddBookPage />} />
              <Route path="edit/:id" element={<EditBookPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
