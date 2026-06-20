import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useGetProductsQuery, useAdminDeleteProductMutation, useAdminCreateProductMutation, useAdminUpdateProductMutation } from '../../redux/apiSlice';

export function AdminProducts() {
  const { data: products, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useAdminDeleteProductMutation();
  const [createProduct] = useAdminCreateProductMutation();
  const [updateProduct] = useAdminUpdateProductMutation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [productData, setProductData] = useState({
    name: '', slug: '', description: '', price: '', stock: '', categoryId: '', imageUrl: ''
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setProductData({ name: '', slug: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: any) => {
    setIsEditMode(true);
    setEditingId(prod.id);
    setProductData({
      name: prod.name || '',
      slug: prod.slug || '',
      description: prod.description || '',
      price: prod.price?.toString() || '',
      stock: prod.stock?.toString() || '',
      categoryId: prod.categoryId || '',
      imageUrl: prod.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productData,
        price: productData.price,
        stock: Number(productData.stock)
      };

      if (isEditMode && editingId) {
        await updateProduct({ id: editingId, changes: payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save the product: ', err);
    }
  };

  const filteredProducts = products?.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Products</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage your product catalog</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
              />
            </div>
            <button 
              onClick={handleOpenAdd}
              className="bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm shadow-primary-blue/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100 text-[13px] uppercase tracking-wider text-slate-500">
                <th className="p-5 font-bold">Product</th>
                <th className="p-5 font-bold">Category</th>
                <th className="p-5 font-bold">Price</th>
                <th className="p-5 font-bold">Stock</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-5 text-center text-slate-500">Loading products...</td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-5 text-center text-slate-500">No products found.</td>
                </tr>
              ) : paginatedProducts.map((prod) => (
                <tr key={prod.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors text-sm group">
                  <td className="p-5 font-medium text-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
                      <img src={prod.imageUrl || 'https://via.placeholder.com/100'} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold">{prod.name}</span>
                  </td>
                  <td className="p-5 text-slate-600 font-medium">{prod.categoryId || 'Uncategorized'}</td>
                  <td className="p-5 font-bold text-slate-800">₹{prod.price}</td>
                  <td className="p-5">
                    <span className="font-bold text-slate-800">{prod.stock}</span>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      prod.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {prod.stock > 0 ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEdit(prod)} className="p-2 text-slate-400 hover:text-primary-blue rounded-lg hover:bg-blue-50 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(prod.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm">
          <p className="text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{filteredProducts.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> of <span className="font-bold text-slate-800">{filteredProducts.length}</span> products
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden xl:block xl:fixed"
              style={{ display: 'block' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-slate-800">{isEditMode ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                  <input type="text" required value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Slug</label>
                  <input type="text" required placeholder="e.g. awesome-product" value={productData.slug} onChange={e => setProductData({...productData, slug: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Price</label>
                    <input type="number" step="0.01" required value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Stock</label>
                    <input type="number" required value={productData.stock} onChange={e => setProductData({...productData, stock: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category ID</label>
                  <input type="text" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                  <input type="url" value={productData.imageUrl} onChange={e => setProductData({...productData, imageUrl: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue text-sm" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm shadow-primary-blue/20">{isEditMode ? 'Save Changes' : 'Save Product'}</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

