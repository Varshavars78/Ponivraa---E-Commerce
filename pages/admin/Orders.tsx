import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storage';
import { Order } from '../../types';
import { Search, MessageSquare, User, MapPin, Phone, Mail } from 'lucide-react';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setOrders(StorageService.getOrders());
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    if(order) {
      const updatedOrder = { ...order, orderStatus: newStatus as any };
      if(newStatus === 'Processing' || newStatus === 'Packed' || newStatus === 'Shipped') {
          updatedOrder.paymentStatus = 'Verified'; // Auto verify payment if processing starts
      }
      StorageService.updateOrder(updatedOrder);
      setOrders(StorageService.getOrders()); // Refresh local state
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(filter.toLowerCase()) ||
    o.userDetails.phone.includes(filter) ||
    o.userDetails.name.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Verified': case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID or Phone..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg">
            {/* Header Bar */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div className="flex items-center space-x-3">
                  <span className="font-bold text-lg text-gray-900">#{order.id}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</span>
               </div>
               <div className="flex items-center space-x-3">
                   <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${getStatusColor(order.orderStatus)}`}>
                       {order.orderStatus}
                   </span>
                   <select 
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white focus:ring-primary-500 focus:border-primary-500"
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
               </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-8">
               {/* Left: Customer Details */}
               <div className="border-r border-gray-100 pr-0 md:pr-6">
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h3>
                   <div className="space-y-3">
                       <div className="flex items-start">
                           <User size={18} className="text-gray-400 mt-0.5 mr-3" />
                           <div>
                               <p className="font-bold text-gray-900">{order.userDetails.name}</p>
                               <p className="text-xs text-gray-500">ID: {order.userId || 'Guest'}</p>
                           </div>
                       </div>
                       <div className="flex items-center">
                           <Phone size={18} className="text-gray-400 mr-3" />
                           <a href={`tel:${order.userDetails.phone}`} className="text-gray-700 hover:text-primary-600">{order.userDetails.phone}</a>
                           <a 
                            href={`https://wa.me/91${order.userDetails.phone}?text=Hi ${order.userDetails.name}, regarding your order #${order.id}...`}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2 bg-green-100 text-green-700 p-1 rounded hover:bg-green-200"
                           >
                               <MessageSquare size={14} />
                           </a>
                       </div>
                       {order.userDetails.email && (
                           <div className="flex items-center">
                                <Mail size={18} className="text-gray-400 mr-3" />
                                <a href={`mailto:${order.userDetails.email}`} className="text-gray-700 hover:text-primary-600">{order.userDetails.email}</a>
                           </div>
                       )}
                       <div className="flex items-start">
                           <MapPin size={18} className="text-gray-400 mt-0.5 mr-3" />
                           <p className="text-gray-700 text-sm w-3/4">
                               {order.userDetails.address}, {order.userDetails.pincode}
                           </p>
                       </div>
                   </div>
               </div>

               {/* Right: Order & Product Details */}
               <div>
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Product Details</h3>
                   <div className="bg-gray-50 rounded-lg p-4 mb-4">
                       <div className="space-y-2">
                           {order.items.map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                                   <div className="flex items-center space-x-2">
                                       <img src={item.imageUrl} alt="" className="w-8 h-8 rounded object-cover border border-gray-200" />
                                       <div>
                                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                       </div>
                                   </div>
                                   <div className="text-right">
                                       <p className="text-sm font-bold text-gray-900">{item.quantity} x ₹{item.discountPrice || item.price}</p>
                                       <p className="text-xs text-gray-500">Total: ₹{(item.discountPrice || item.price) * item.quantity}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
                   
                   <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <div>
                            <span className="block text-xs text-gray-500">Payment Method</span>
                            <span className="font-medium text-gray-900">UPI (Ref: {order.transactionId})</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-xs text-gray-500">Total Amount</span>
                            <span className="text-2xl font-bold text-earth-900">₹{order.totalAmount}</span>
                        </div>
                   </div>
               </div>
            </div>
          </div>
        ))}
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">No orders found matching your search.</div>
        )}
      </div>
    </div>
  );
};