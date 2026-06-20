import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Download } from 'lucide-react';
import { useAdminGetOrdersQuery, useAdminUpdateOrderStatusMutation } from '../../redux/apiSlice';

export function AdminOrders() {
  const { data: orders, isLoading } = useAdminGetOrdersQuery();
  const [updateStatus] = useAdminUpdateOrderStatusMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = async (id: string, status: string) => {
    await updateStatus({ id, status });
  };

  const filteredOrders = orders?.filter((o: any) => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Orders</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage and track your latest orders</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-gray-100 text-[13px] uppercase tracking-wider text-slate-500">
              <th className="p-5 font-bold">Order ID</th>
              <th className="p-5 font-bold">Customer</th>
              <th className="p-5 font-bold">Date</th>
              <th className="p-5 font-bold">Total</th>
              <th className="p-5 font-bold">Status</th>
              <th className="p-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-5 text-center text-slate-500">Loading orders...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-5 text-center text-slate-500">No orders found.</td>
              </tr>
            ) : filteredOrders.map((order: any) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors text-sm group">
                <td className="p-5 font-bold text-primary-blue">#ORD-{order.id.slice(0, 8)}</td>
                <td className="p-5">
                  <p className="font-bold text-slate-800">{order.customerName || 'Guest User'}</p>
                  <p className="text-xs text-slate-500 font-medium">{order.customerEmail || 'No email'}</p>
                </td>
                <td className="p-5 text-slate-600 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-5 font-bold text-slate-800">₹{order.totalAmount}</td>
                <td className="p-5">
                  <select 
                    value={order.orderStatus} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border-none outline-none cursor-pointer appearance-none ${
                    order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                    order.orderStatus === 'processing' ? 'bg-amber-50 text-amber-600' :
                    order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-5 text-right">
                  <button className="p-2 text-slate-400 hover:text-primary-blue rounded-lg hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm">
        <p className="text-slate-500 font-medium">Showing <span className="font-bold text-slate-800">{filteredOrders.length > 0 ? 1 : 0}</span> to <span className="font-bold text-slate-800">{filteredOrders.length}</span> of <span className="font-bold text-slate-800">{filteredOrders.length}</span> orders</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50" disabled>Previous</button>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors" disabled>Next</button>
        </div>
      </div>
    </motion.div>
  );
}
