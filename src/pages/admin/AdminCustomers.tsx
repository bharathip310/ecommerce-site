import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, Mail, Loader2, Edit, Trash2, Eye, Ban } from 'lucide-react';
import { useAdminGetCustomersQuery } from '../../redux/apiSlice.ts';
import toast from 'react-hot-toast';

export function AdminCustomers() {
  const { data: customers, isLoading } = useAdminGetCustomersQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const itemsPerPage = 5;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
      </div>
    );
  }

  const allCustomers = customers || [];
  
  const filteredCustomers = allCustomers.filter((user: any) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handleEmailCustomer = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleFilter = () => {
    toast('Filters panel is currently under development.', { icon: '📊' });
  };

  const handleAction = (action: string, name: string) => {
    setOpenMenuId(null);
    toast.success(`${action} account for ${name} (Demo)`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px]"
      onClick={() => setOpenMenuId(null)}
    >
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Customers</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your customer base</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
            />
          </div>
          <button onClick={handleFilter} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-visible">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-gray-100 text-[13px] uppercase tracking-wider text-slate-500">
              <th className="p-5 font-bold col-span-2">Customer</th>
              <th className="p-5 font-bold">Location</th>
              <th className="p-5 font-bold">Orders</th>
              <th className="p-5 font-bold">Total Spent</th>
              <th className="p-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayCustomers.map((user: any) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors text-sm group">
                <td className="p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${user.color || 'bg-blue-100 text-blue-600'}`}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                  </div>
                </td>
                <td className="p-5 text-slate-600 font-medium">{user.location}</td>
                <td className="p-5">
                  <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">{user.orders}</span>
                </td>
                <td className="p-5 font-bold text-slate-800">{user.spent}</td>
                <td className="p-5 text-right relative">
                  <div className={`flex items-center justify-end gap-2 transition-opacity ${openMenuId === user.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button onClick={() => handleEmailCustomer(user.email)} className="p-2 text-slate-400 hover:text-primary-blue rounded-lg hover:bg-blue-50 transition-colors" title="Send Email">
                      <Mail className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === user.id ? null : user.id); }} 
                        className={`p-2 text-slate-400 hover:text-primary-blue rounded-lg hover:bg-blue-50 transition-colors ${openMenuId === user.id ? 'bg-blue-50 text-primary-blue' : ''}`} 
                        title="More"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {openMenuId === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 top-10 w-48 bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-50 text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button onClick={() => handleAction('Viewed', user.name)} className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-blue transition-colors flex items-center gap-2">
                              <Eye className="w-4 h-4" /> View Details
                            </button>
                            <button onClick={() => handleAction('Edited', user.name)} className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-blue transition-colors flex items-center gap-2">
                              <Edit className="w-4 h-4" /> Edit Customer
                            </button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button onClick={() => handleAction('Suspended', user.name)} className="w-full px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2">
                              <Ban className="w-4 h-4" /> Suspend Account
                            </button>
                            <button onClick={() => handleAction('Deleted', user.name)} className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                              <Trash2 className="w-4 h-4" /> Delete Account
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {displayCustomers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm">
        <p className="text-slate-500 font-medium">Showing <span className="font-bold text-slate-800">{filteredCustomers.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredCustomers.length)}</span> of <span className="font-bold text-slate-800">{filteredCustomers.length}</span> customers</p>
        <div className="flex gap-2">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
