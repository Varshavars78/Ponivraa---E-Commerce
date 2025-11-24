import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

export const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || 'Unknown';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
        <CheckCircle size={48} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-6">Order ID: <span className="font-mono font-bold text-gray-800">{orderId}</span></p>
      
      <div className="max-w-md text-sm text-gray-500 bg-gray-50 p-6 rounded-xl mb-8">
        <p className="mb-2">Thank you for supporting sustainable farming.</p>
        <p>We will verify your payment and process your order shortly. You will receive updates on your phone number.</p>
      </div>

      <Link to="/" className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
        <Home size={18} className="mr-2" /> Return Home
      </Link>
    </div>
  );
};
