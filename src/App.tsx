/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout.tsx';
import { AnimatedRoutes } from './components/AnimatedRoutes.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { AdminRoutes } from './components/admin/AdminRoutes.tsx';

export default function App() {
  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={
            <AdminLayout>
              <AdminRoutes />
            </AdminLayout>
          } />
          <Route path="/*" element={
            <Layout>
              <AnimatedRoutes />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }} />
    </div>
  );
}
