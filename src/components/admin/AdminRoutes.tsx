import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../../pages/admin/AdminDashboard.tsx';
import { AdminOrders } from '../../pages/admin/AdminOrders.tsx';
import { AdminProducts } from '../../pages/admin/AdminProducts.tsx';
import { AdminCustomers } from '../../pages/admin/AdminCustomers.tsx';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/products" element={<AdminProducts />} />
      <Route path="/customers" element={<AdminCustomers />} />
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
}
