import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { StoreProvider, useStore } from './context/StoreContext';
import { LanguageProvider } from './context/LanguageContext';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { Profile } from './pages/Profile';
import { ProductDetails } from './pages/ProductDetails';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';
import { AdminSettings } from './pages/admin/Settings';
import { ChatBot } from './components/ChatBot';
import { LayoutDashboard, Package, ShoppingBag, Settings } from 'lucide-react';

// Layouts
const MainLayout = () => (
  <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <ChatBot />
    <footer className="bg-earth-900 text-earth-100 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Ponivraa</h3>
          <p className="text-sm leading-relaxed opacity-80">Direct from our farm to your table. Experience the authentic taste of nature without chemicals or preservatives.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop Honey</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop Oils</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
          </ul>
        </div>
        <div>
           <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
           <p className="text-sm opacity-80">Farm Address: Alagarkovil, Tamil Nadu.</p>
           <p className="text-sm opacity-80 mt-2">Email: ponivraa@gmail.com</p>
           <p className="text-sm opacity-80">Phone: +91 80982 02289</p>
        </div>
      </div>
      <div className="text-center text-xs opacity-50 mt-12 border-t border-earth-800 pt-8">
        © 2024 Ponivraa. All rights reserved.
      </div>
    </footer>
  </div>
);

const AdminLayout = () => {
  const { isAdmin } = useStore();
  const location = useLocation();
  
  if (!isAdmin) return <Navigate to="/login" />;

  const AdminLink = ({ to, icon: Icon, label }: any) => {
      const active = location.pathname === to;
      return (
        <Link to={to} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </Link>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-earth-900">Ponivraa<span className="text-primary-600">.Admin</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <AdminLink to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <AdminLink to="/admin/products" icon={Package} label="Products" />
            <AdminLink to="/admin/orders" icon={ShoppingBag} label="Orders" />
            <AdminLink to="/admin/settings" icon={Settings} label="Settings" />
        </nav>
        <div className="p-4 border-t border-gray-100">
            <Link to="/" className="text-sm text-gray-500 hover:text-primary-600 flex items-center">← Back to Store</Link>
        </div>
      </aside>
      
      {/* Mobile Header for Admin */}
      <div className="flex-1 flex flex-col">
          <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
             <span className="font-bold text-lg">Admin Panel</span>
             <div className="space-x-4 text-sm">
                <Link to="/admin/dashboard">Stats</Link>
                <Link to="/admin/orders">Orders</Link>
             </div>
          </header>
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <Outlet />
          </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              {/* Redirect old admin route to new unified login */}
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </LanguageProvider>
    </StoreProvider>
  );
};

export default App;