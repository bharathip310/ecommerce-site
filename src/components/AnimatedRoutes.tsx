import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Home } from '../pages/Home.tsx';
import { Products } from '../pages/Products.tsx';
import { ProductDetail } from '../pages/ProductDetail.tsx';
import { Checkout } from '../pages/Checkout.tsx';
import { Collection } from '../pages/Collection.tsx';
import { Dashboard } from '../pages/Dashboard.tsx';
import { Login } from '../pages/Login.tsx';

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/categories" element={<Collection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AnimatePresence>
  );
}
