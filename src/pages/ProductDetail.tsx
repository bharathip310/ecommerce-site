import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductBySlugQuery, useGetProductReviewsQuery, useCreateProductReviewMutation } from '../redux/apiSlice.ts';
import { useDispatch } from 'react-redux';
import { addToCart, openCart } from '../redux/cartSlice.ts';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingBag, Heart, ShieldCheck, Truck, ShoppingCart, User } from 'lucide-react';
import { getAuth } from 'firebase/auth';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useGetProductBySlugQuery(slug || '');
  const dispatch = useDispatch();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // We can only fetch reviews if we have product.id
  const { data: reviews = [], refetch: refetchReviews } = useGetProductReviewsQuery(product?.id || '', {
    skip: !product?.id,
  });
  const [createReview, { isLoading: isSubmitting }] = useCreateProductReviewMutation();

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      toast.success(`${product.name} added to cart!`);
      dispatch(openCart());
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      await createReview({
        id: product.id,
        review: {
          rating,
          comment,
          uid: currentUser?.uid,
          email: currentUser?.email,
          name: currentUser?.displayName
        }
      }).unwrap();
      
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      refetchReviews();
    } catch (err) {
      toast.error('Failed to submit review.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-primary-blue border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium tracking-wide">Product not found.</p>
        <Link to="/products" className="btn-secondary">Back to Collection</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="container mx-auto px-4 md:px-10 py-10 relative z-10 w-full max-w-[1200px]"
    >
      <Link to="/products" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="bg-white border border-border-light shadow-sm p-5 rounded-md overflow-visible group">
            <div className="w-full aspect-square rounded-[4px] overflow-hidden bg-gray-100 flex items-center justify-center relative">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} loading="eager" fetchPriority="high" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-gray-300" />
                </div>
              )}
              {product.featured && (
                <span className="absolute top-5 left-5 bg-primary-yellow text-white text-xs font-[800] px-4 py-2 rounded-[4px] z-10 shadow-sm uppercase tracking-wider">
                  FEATURED EXCLUSIVE
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
           className="flex flex-col xl:pl-4"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="text-primary-blue text-[13px] font-bold tracking-[1px] uppercase">Category Name</span>
            <div className="flex items-center gap-1.5 bg-white border border-border-light px-3 py-1.5 rounded-md shadow-sm">
              <Star className="w-4 h-4 fill-primary-blue text-primary-blue" />
              <span className="text-sm font-bold mt-[1px] text-text-main">{product.rating}</span>
            </div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl md:text-[50px] font-bold mb-6 tracking-[-1px] leading-[1.1] text-text-main"
          >
            {product.name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[40px] font-bold text-text-main mb-8 flex items-center gap-4"
          >
            ₹{product.price}
            {product.stock < 20 && (
              <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-[4px] border border-red-200 tracking-wide">
                Only {product.stock} left
              </span>
            )}
          </motion.div>
          
          <p className="text-text-muted text-[17px] leading-[1.8] mb-10 font-medium">
            {product.description}
          </p>

          <div className="h-[1px] w-full bg-border-light mb-10"></div>

          <div className="flex items-center gap-5 mb-10">
            <button 
              onClick={handleAddToCart}
              className="btn-primary flex-1 !p-4 !text-[16px] justify-center active:scale-95 text-white bg-primary-orange"
            >
              <ShoppingCart className="w-6 h-6 mr-2" /> Add to Cart
            </button>
            <button className="h-[60px] w-[60px] flex items-center justify-center rounded-[4px] bg-white border border-border-light hover:bg-gray-50 text-text-main hover:text-red-500 shrink-0 group active:scale-95 shadow-sm">
              <Heart className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white border border-border-light rounded-md p-5 flex flex-col md:flex-row items-start md:items-center gap-4 hover:shadow-sm transition-shadow group">
              <div className="p-3 bg-blue-50 rounded-[4px] group-hover:bg-blue-100 transition-colors">
                <Truck className="w-6 h-6 text-primary-blue" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-text-main mb-1">Priority Delivery</div>
                <div className="text-[13px] text-text-muted font-medium">Dispatched within 24h</div>
              </div>
            </div>
            <div className="bg-white border border-border-light rounded-md p-5 flex flex-col md:flex-row items-start md:items-center gap-4 hover:shadow-sm transition-shadow group">
              <div className="p-3 bg-indigo-50 rounded-[4px] group-hover:bg-indigo-100 transition-colors">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-text-main mb-1">Global Warranty</div>
                <div className="text-[13px] text-text-muted font-medium">Included for 2 years</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
        className="mt-20 border-t border-border-light pt-10"
      >
        <h2 className="text-2xl font-bold text-text-main mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 border border-border-light rounded-md shadow-sm">
              <h3 className="text-lg font-bold text-text-main mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-text-muted mb-2">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-primary-yellow text-primary-yellow' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-text-muted mb-2">Review</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={4}
                    className="w-full border border-border-light rounded-[4px] p-3 text-sm focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
                    placeholder="Tell us what you think..."
                  ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 border border-border-light rounded-md border-dashed">
                <p className="text-text-muted font-medium">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div key={review.id} className="bg-white p-6 border border-border-light rounded-md shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary-blue font-bold">
                          {review.userAvatar ? (
                            <img src={review.userAvatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            review.userName ? review.userName.charAt(0).toUpperCase() : <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-text-main text-sm">{review.userName || 'Guest User'}</div>
                          <div className="text-xs text-text-muted">{new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-primary-yellow text-primary-yellow' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-text-main text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
