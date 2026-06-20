import React, { useState, useMemo } from 'react';
import { useGetProductsQuery, Product } from '../redux/apiSlice.ts';
import { useDispatch } from 'react-redux';
import { addToCart, openCart } from '../redux/cartSlice.ts';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Star, ShoppingBag, Loader2, X, Check, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

const BRANDS = [
  'Apple', 'Samsung', 'Sony', 'Garmin', 
  'Bose', 'Dell', 'Google', 'Nintendo', 
  'Logitech', 'Keychron', 'PlayStation', 'Xbox'
];

export function Products() {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const dispatch = useDispatch();

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  
  // Filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
    dispatch(openCart());
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products.filter(p => {
      const price = parseFloat(p.price);
      if (price > maxPrice) return false;
      
      const rating = parseFloat(p.rating);
      if (rating < minRating) return false;

      if (selectedBrands.length > 0) {
        const productName = p.name.toLowerCase();
        const matchesBrand = selectedBrands.some(brand => {
          if (brand === 'Apple' && (productName.includes('macbook') || productName.includes('ipad') || productName.includes('iphone'))) return true;
          return productName.includes(brand.toLowerCase());
        });
        if (!matchesBrand) return false;
      }
      
      return true;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else {
      // featured
      result.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
    }

    return result;
  }, [products, maxPrice, minRating, selectedBrands, sortBy]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load products. Please check connection.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="container mx-auto px-4 md:px-10 py-10 relative z-10 w-full max-w-[1400px]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-border-light pb-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-[40px] font-bold text-text-main">
            All Collection
          </h1>
          <p className="text-sm text-text-muted mt-2 tracking-wide font-medium">Showing {filteredProducts.length} premium results</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3"
        >
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-white border border-border-light hover:bg-gray-50 flex items-center gap-2 transition-colors text-sm rounded-md shadow-sm font-semibold px-4 py-2.5 text-text-main"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowSort(!showSort)}
              className="bg-white border border-border-light hover:bg-gray-50 flex items-center gap-2 transition-colors text-sm rounded-md shadow-sm font-semibold px-4 py-2.5 text-text-main"
            >
              Sort by: {sortBy === 'price-low' ? 'Price: Low-High' : sortBy === 'price-high' ? 'Price: High-Low' : sortBy === 'rating' ? 'Top Rated' : 'Featured'} <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-border-light rounded-md shadow-lg z-50 overflow-hidden"
                >
                  {['featured', 'price-low', 'price-high', 'rating'].map((sortKey) => (
                    <button
                      key={sortKey}
                      onClick={() => { setSortBy(sortKey); setShowSort(false); }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 flex items-center justify-between ${sortBy === sortKey ? 'text-primary-blue bg-blue-50/50' : 'text-text-main'}`}
                    >
                      {sortKey === 'price-low' ? 'Price: Low to High' : sortKey === 'price-high' ? 'Price: High to Low' : sortKey === 'rating' ? 'Top Rated' : 'Featured'}
                      {sortBy === sortKey && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`lg:w-[260px] flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white border border-border-light rounded-md shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center justify-between">
                Price Range 
                <span className="text-primary-blue font-mono">₹{maxPrice}</span>
              </h3>
              <input 
                type="range" 
                min="0" 
                max="3000" 
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-blue"
              />
              <div className="flex justify-between text-xs text-text-muted mt-2 font-mono">
                <span>₹0</span>
                <span>₹3000+</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Brands</h3>
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {BRANDS.map(brand => (
                  <label key={brand} onClick={() => toggleBrand(brand)} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-primary-blue border-primary-blue' : 'border-gray-300 group-hover:border-primary-blue'}`}>
                      {selectedBrands.includes(brand) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-text-main hover:text-primary-blue transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Minimum Rating</h3>
              <div className="space-y-3">
                {[4.5, 4.0, 3.5].map(rating => (
                  <label key={rating} onClick={() => setMinRating(rating)} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${minRating === rating ? 'border-primary-blue' : 'border-gray-300 group-hover:border-primary-blue'}`}>
                      {minRating === rating && <div className="w-2 h-2 rounded-full bg-primary-blue" />}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${minRating === rating ? 'text-primary-yellow fill-primary-yellow' : 'text-gray-300 fill-gray-300'}`} />
                      <span className="text-sm font-medium text-text-main hover:text-primary-blue transition-colors">{rating} & Up</span>
                    </div>
                  </label>
                ))}
                <label onClick={() => setMinRating(0)} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${minRating === 0 ? 'border-primary-blue' : 'border-gray-300 group-hover:border-primary-blue'}`}>
                    {minRating === 0 && <div className="w-2 h-2 rounded-full bg-primary-blue" />}
                  </div>
                  <span className="text-sm font-medium text-text-main hover:text-primary-blue transition-colors">Any Rating</span>
                </label>
              </div>
            </div>
            
            {(selectedBrands.length > 0 || maxPrice < 3000 || minRating > 0) && (
              <button 
                onClick={() => {
                  setSelectedBrands([]);
                  setMaxPrice(3000);
                  setMinRating(0);
                }}
                className="w-full mt-6 py-2 text-sm font-bold text-text-muted hover:text-primary-blue transition-colors border border-border-light rounded-md"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-border-light rounded-md p-10 flex flex-col items-center justify-center text-center h-[400px]">
              <SearchX className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-text-main mb-2">No products found</h3>
              <p className="text-text-muted max-w-md">Try adjusting your filters, changing the price range, or selecting different brands.</p>
              <button 
                onClick={() => {
                  setSelectedBrands([]);
                  setMaxPrice(3000);
                  setMinRating(0);
                }}
                className="mt-6 px-6 py-2.5 bg-primary-blue text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: (index % 3) * 0.05, ease: 'easeOut' }}
                >
                  <div className="bg-white border border-border-light shadow-sm h-full flex flex-col p-5 relative transition-all duration-300 hover:shadow-md group rounded-md">
                    <Link to={`/products/${product.slug}`} className="absolute inset-0 z-10" />
                    <div className="w-full aspect-square rounded-[4px] overflow-hidden bg-gray-100 relative mb-5 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-14 h-14 text-gray-300" />
                        </div>
                      )}
                      {product.featured && (
                        <span className="absolute top-2 left-2 bg-primary-yellow text-white text-[10px] font-bold px-2 py-1 rounded-[4px] z-20 shadow-sm uppercase tracking-wide">
                          Featured
                        </span>
                      )}
                      <div className="absolute top-2 right-2 bg-white rounded-full flex items-center gap-1 z-20 shadow-sm px-2 py-1 border border-border-light">
                        <Star className="w-3 h-3 fill-primary-blue text-primary-blue" />
                        <span className="text-[11px] font-bold text-text-main mt-[1px]">{product.rating}</span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col relative z-20">
                      <h3 className="text-[17px] font-bold text-text-main mb-2 leading-tight group-hover:text-primary-blue transition-colors line-clamp-1">{product.name}</h3>
                      <p className="text-[13px] text-text-muted line-clamp-2 mb-5 font-medium leading-relaxed">{product.description}</p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-light">
                        <div className="text-[20px] font-bold text-text-main">₹{product.price}</div>
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="p-2 rounded-full bg-primary-blue text-white hover:bg-blue-600 transition-colors shadow-sm active:scale-95 z-30 relative flex items-center justify-center" 
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

