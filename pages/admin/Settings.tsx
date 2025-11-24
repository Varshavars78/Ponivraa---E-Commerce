import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ToggleLeft, ToggleRight, CreditCard, QrCode } from 'lucide-react';

export const AdminSettings = () => {
  const { paymentSettings, updatePaymentSettings } = useStore();
  const [success, setSuccess] = useState('');

  const toggleUpi = () => {
    const newSettings = { ...paymentSettings, upiEnabled: !paymentSettings.upiEnabled };
    updatePaymentSettings(newSettings);
    showSuccess('Payment settings updated');
  };

  const toggleRazorpay = () => {
    const newSettings = { ...paymentSettings, razorpayEnabled: !paymentSettings.razorpayEnabled };
    updatePaymentSettings(newSettings);
    showSuccess('Payment settings updated');
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      {success && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <span className="font-medium">{success}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Payment Methods Configuration</h2>
            <p className="text-sm text-gray-500">Enable or disable payment options available at checkout.</p>
        </div>
        
        <div className="p-6 space-y-6">
            {/* UPI Settings */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <QrCode size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Manual UPI Payment</h3>
                        <p className="text-sm text-gray-500">Customers scan QR code and upload transaction ID.</p>
                    </div>
                </div>
                <button onClick={toggleUpi} className={`focus:outline-none transition-colors duration-200 ${paymentSettings.upiEnabled ? 'text-primary-600' : 'text-gray-300'}`}>
                    {paymentSettings.upiEnabled ? <ToggleRight size={48} fill="currentColor" /> : <ToggleLeft size={48} />}
                </button>
            </div>

            {/* Razorpay Settings */}
             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Razorpay Gateway</h3>
                        <p className="text-sm text-gray-500">Accept Card, Netbanking, and UPI via Razorpay.</p>
                    </div>
                </div>
                <button onClick={toggleRazorpay} className={`focus:outline-none transition-colors duration-200 ${paymentSettings.razorpayEnabled ? 'text-primary-600' : 'text-gray-300'}`}>
                    {paymentSettings.razorpayEnabled ? <ToggleRight size={48} fill="currentColor" /> : <ToggleLeft size={48} />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};