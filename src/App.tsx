import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/Layout';
import { Toaster } from './components/ui/Toast';
import { Home } from './pages/Home';
import { GenerateQuote } from './pages/GenerateQuote';
import { PresetValues } from './pages/PresetValues';
import { Catalog } from './pages/Catalog';
import { Quotes } from './pages/Quotes';
import { QuoteTemplate } from './pages/QuoteTemplate';
import { QuoteView } from './pages/QuoteView';
import { QuoteEdit } from './pages/QuoteEdit';
import { Login } from './pages/Login';
import { UserProfile } from './pages/UserProfile';
import { UserManagement } from './pages/UserManagement';
import { ClientQuoteView } from './pages/ClientQuoteView';
import { ClientReceiptView } from './pages/ClientReceiptView';
import { NotFound } from './pages/NotFound';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { OrderEdit } from './pages/OrderEdit';
import { ReceiptTemplate } from './pages/ReceiptTemplate';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/client/quote/:id" element={<ClientQuoteView />} />
          <Route path="/client/receipt/:orderId/:receiptId" element={<ClientReceiptView />} />
          <Route path="/404" element={<NotFound />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="profile" element={<UserProfile />} />
            <Route
              path="users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="generate-quote"
              element={
                <ProtectedRoute requiredRole="sales">
                  <GenerateQuote />
                </ProtectedRoute>
              }
            />
            <Route
              path="preset-values"
              element={
                <ProtectedRoute requiredRole="admin">
                  <PresetValues />
                </ProtectedRoute>
              }
            />
            <Route
              path="catalog"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Catalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="quotes"
              element={
                <ProtectedRoute requiredRole="sales">
                  <Quotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute requiredRole="sales">
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders/:id"
              element={
                <ProtectedRoute requiredRole="sales">
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders/:id/edit"
              element={
                <ProtectedRoute requiredRole="sales">
                  <OrderEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="receipt-template"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ReceiptTemplate />
                </ProtectedRoute>
              }
            />
            <Route
              path="quotes/:id/view"
              element={
                <ProtectedRoute requiredRole="sales">
                  <QuoteView />
                </ProtectedRoute>
              }
            />
            <Route
              path="quotes/:id/edit"
              element={
                <ProtectedRoute requiredRole="sales">
                  <QuoteEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="quote-template"
              element={
                <ProtectedRoute requiredRole="admin">
                  <QuoteTemplate />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}