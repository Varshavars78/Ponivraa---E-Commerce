import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { StorageService } from '../services/storage';
import { User, Order } from '../types';
import { UserCircle, Save, MapPin, Phone, Mail, User as UserIcon, Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';

export const Profile = () => {
  const { user, refreshAuth } = useStore();
  const [activeTab, setActiveTab] = useState<'details' | 'orders'>('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      setFormData(user);
      setMyOrders(StorageService.getUserOrders(user.id));
    }
  }, [user, activeTab]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData) return;

    // Phone Validation: Must be exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
        setError('Invalid phone number. Please enter exactly 10 digits.');
        return;
    }

    StorageService.updateCurrentUser(formData);
    refreshAuth();
    setIsEditing(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!user || !formData) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <p>Please log in to view your profile.</p>
        </div>
    );
  }

  // Status Stepper Component
  const OrderTracker = ({ status }: { status: string }) => {
      const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
      const currentStepIndex = steps.indexOf(status) === -1 && status === 'Cancelled' ? -1 : steps.indexOf(status);
      
      if (status === 'Cancelled') {
          return <div className="text-red-600 font-bold bg-red-50 p-2 rounded text-center text-sm mt-4">Order Cancelled</div>;
      }

      return (
          <div className="mt-6">
              <div className="relative flex justify-between items-center w-full">
                  {/* Progress Bar Background */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                  {/* Active Progress Bar */}
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary-600 -z-10 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  ></div>

                  {steps.map((step, index) => {
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      
                      let Icon = Clock;
                      if (step === 'Processing') Icon = Package;
                      if (step === 'Shipped') Icon = Truck;
                      if (step === 'Delivered') Icon = CheckCircle;

                      return (
                          <div key={step} className="flex flex-col items-center bg-white px-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                                  isCompleted ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-300'
                              }`}>
                                  <Icon size={14} />
                              </div>
                              <span className={`text-[10px] mt-1 font-medium ${isCurrent ? 'text-primary-700 font-bold' : 'text-gray-500'}`}>{step}</span>
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-primary-600 p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm border-2 border-white/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-primary-100 text-sm">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'orders' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                My Orders
            </button>
            <button 
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Account Details
            </button>
        </div>

        <div className="p-6 md:p-8 flex-1 bg-gray-50">
            {activeTab === 'orders' ? (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Order History</h2>
                    {myOrders.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                            <Package size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        myOrders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                                        <p className="font-mono font-bold text-lg text-gray-900">#{order.id}</p>
                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</span>
                                        <p className="font-bold text-xl text-earth-900">₹{order.totalAmount}</p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-2 mb-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-700"><span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}</span>
                                            <span className="text-gray-500">₹{(item.discountPrice || item.price) * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Tracking UI */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Order Status</h4>
                                    <OrderTracker status={order.orderStatus} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                // Account Details Form
                <div>
                     {message && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6 text-sm border border-green-100 flex items-center">
                        <CheckCircle size={16} className="mr-2" /> {message}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm border border-red-100 flex items-center">
                        <AlertCircle size={16} className="mr-2" /> {error}
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-primary-600 text-sm font-medium hover:underline"
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                                    <div className="relative">
                                        <UserIcon size={16} className="absolute left-3 top-3 text-gray-400 z-10" />
                                        <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 disabled:bg-gray-50 disabled:text-gray-500 bg-white text-gray-900 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-3 text-gray-400 z-10" />
                                        <input 
                                        type="email" 
                                        disabled={!isEditing}
                                        value={formData.email || ''}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 disabled:bg-gray-50 disabled:text-gray-500 bg-white text-gray-900 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-3 text-gray-400 z-10" />
                                        <input 
                                        type="tel" 
                                        disabled={!isEditing}
                                        value={formData.phone || ''}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 disabled:bg-gray-50 disabled:text-gray-500 bg-white text-gray-900 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                        placeholder="10 digit number"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Address</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-3 text-gray-400 z-10" />
                                        <textarea 
                                        rows={3}
                                        disabled={!isEditing}
                                        value={formData.address || ''}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                        className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 disabled:bg-gray-50 disabled:text-gray-500 bg-white text-gray-900 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                            <div className="pt-4 flex justify-end">
                                <button 
                                type="submit" 
                                className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-700 shadow-md flex items-center text-sm"
                                >
                                <Save size={16} className="mr-2" /> Save Changes
                                </button>
                            </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};