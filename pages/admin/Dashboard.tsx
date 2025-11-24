import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StorageService } from '../../services/storage';
import { Order } from '../../types';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, DollarSign, Users, AlertCircle, ArrowRight, AlertTriangle } from 'lucide-react';

export const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { products } = useStore();
  
  useEffect(() => {
    setOrders(StorageService.getOrders());
  }, []);

  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
  
  // Low stock logic
  const lowStockProducts = products.filter(p => p.stock < 10);

  // Mock chart data generation from orders
  const salesData = orders.slice(0, 7).map((o, i) => ({
    name: `Order ${i+1}`,
    amount: o.totalAmount
  })).reverse();

  const statusData = [
    { name: 'Pending', count: orders.filter(o => o.orderStatus === 'Pending').length },
    { name: 'Shipped', count: orders.filter(o => o.orderStatus === 'Shipped').length },
    { name: 'Delivered', count: orders.filter(o => o.orderStatus === 'Delivered').length },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${color} text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sales" value={`₹${totalSales}`} icon={DollarSign} color="bg-green-600" />
        <StatCard title="Total Orders" value={totalOrders} icon={Package} color="bg-blue-600" />
        <StatCard title="Pending Orders" value={pendingOrders} icon={AlertCircle} color="bg-yellow-500" />
        <StatCard title="Customers" value={orders.length} icon={Users} color="bg-purple-600" />
      </div>

      {/* Low Stock Alert Section */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-red-700">
                    <AlertTriangle size={24} />
                    <h2 className="text-lg font-bold">Low Stock Alerts</h2>
                </div>
                <Link to="/admin/products" className="text-sm text-red-600 font-medium hover:underline flex items-center">
                    Manage Inventory <ArrowRight size={16} className="ml-1"/>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {lowStockProducts.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border border-red-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img src={p.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                                <p className="text-xs text-gray-500">Category: {p.category}</p>
                            </div>
                        </div>
                        <div className="text-center bg-red-100 text-red-800 px-3 py-1 rounded-lg">
                            <span className="block text-xs font-bold uppercase">Stock</span>
                            <span className="text-lg font-bold">{p.stock}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Recent Sales Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Order Status Distribution</h3>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};