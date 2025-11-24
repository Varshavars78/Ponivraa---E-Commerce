import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { StorageService } from '../services/storage';
import { Order, UserDetails } from '../types';
import { QrCode, AlertCircle, CreditCard, Wallet, Loader, Lock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Checkout = () => {
  const { cart, cartTotal, clearCart, user, paymentSettings } = useStore();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Details, 2: Payment
  
  const [formData, setFormData] = useState<UserDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: ''
  });

  // Payment Selection State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'Razorpay'>(
    paymentSettings.razorpayEnabled ? 'Razorpay' : 'UPI'
  );
  const [showCardForm, setShowCardForm] = useState(false);
  
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Pre-fill data
  useEffect(() => {
    if (user) {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            pincode: ''
        });
    }
  }, [user]);

  // Update default payment method if settings change
  useEffect(() => {
     if(paymentSettings.razorpayEnabled && !paymentSettings.upiEnabled) setSelectedPaymentMethod('Razorpay');
     if(!paymentSettings.razorpayEnabled && paymentSettings.upiEnabled) setSelectedPaymentMethod('UPI');
  }, [paymentSettings]);

  if(cart.length === 0) {
      navigate('/cart');
      return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode || !formData.email) {
      setError('Please fill in all fields');
      return;
    }

    const cleanPhone = formData.phone.trim();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(cleanPhone)) {
        setError('Invalid phone number. Please enter a valid 10-digit number (no spaces).');
        return;
    }

    const cleanPin = formData.pincode.trim();
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(cleanPin)) {
        setError('Invalid pincode. Please enter a valid 6-digit code (no spaces).');
        return;
    }

    setStep(2);
  };

  const createOrder = (method: 'UPI' | 'Razorpay', txnId: string, status: 'Pending' | 'Verified') => {
    const newOrder: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        userId: user?.id,
        userDetails: {
            ...formData,
            phone: formData.phone.trim(),
            pincode: formData.pincode.trim()
        },
        items: [...cart],
        totalAmount: cartTotal,
        transactionId: txnId,
        paymentMethod: method,
        paymentStatus: status,
        orderStatus: 'Pending',
        createdAt: new Date().toISOString()
    };

    StorageService.createOrder(newOrder);
    clearCart();
    navigate('/order-success', { state: { orderId: newOrder.id } });
  };

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) {
      setError('Please enter the UPI Transaction ID');
      return;
    }
    createOrder('UPI', transactionId, 'Pending');
  };

  const handleRazorpayFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);
      // Simulate Processing
      setTimeout(() => {
          setIsProcessing(false);
          const mockTxnId = `pay_${Date.now()}`;
          createOrder('Razorpay', mockTxnId, 'Verified');
      }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">{t('Checkout')}</h1>

      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>1</div>
          <span className="ml-2 font-medium">Details</span>
        </div>
        <div className="w-16 h-1 bg-gray-200 mx-4"></div>
        <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>2</div>
          <span className="ml-2 font-medium">{t('Payment')}</span>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center">
            <AlertCircle size={16} className="mr-2" /> {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" required placeholder="e.g. john@example.com" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" name="phone" required placeholder="10 digit mobile number" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea name="address" required rows={3} value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input type="text" name="pincode" required placeholder="6 digit pincode" value={formData.pincode} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 mt-4">
              Next: Payment
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Select Payment Method</h2>
            
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-sm text-yellow-800 text-center">
               <strong className="text-xl">Total Amount: ₹{cartTotal}</strong>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4">
                {paymentSettings.razorpayEnabled && (
                    <button 
                        onClick={() => { setSelectedPaymentMethod('Razorpay'); setShowCardForm(false); }}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${selectedPaymentMethod === 'Razorpay' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200 text-gray-600'}`}
                    >
                        <CreditCard size={28} />
                        <span className="font-bold">Razorpay</span>
                    </button>
                )}
                {paymentSettings.upiEnabled && (
                    <button 
                        onClick={() => { setSelectedPaymentMethod('UPI'); setShowCardForm(false); }}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${selectedPaymentMethod === 'UPI' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-200 text-gray-600'}`}
                    >
                        <QrCode size={28} />
                        <span className="font-bold">Manual UPI</span>
                    </button>
                )}
            </div>

            {!paymentSettings.razorpayEnabled && !paymentSettings.upiEnabled && (
                <div className="text-center text-red-500 py-8">
                    No payment methods are currently active. Please contact support.
                </div>
            )}

            {/* Razorpay Section */}
            {selectedPaymentMethod === 'Razorpay' && paymentSettings.razorpayEnabled && (
                <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 bg-indigo-50/30">
                     {!showCardForm ? (
                         <div className="flex flex-col items-center justify-center">
                            <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                                <Wallet className="text-indigo-600" size={32} />
                            </div>
                            <p className="text-center text-gray-600 mb-6">Securely pay using Credit/Debit Card, Netbanking, or UPI via Razorpay.</p>
                            
                            <button 
                                onClick={() => setShowCardForm(true)}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-lg"
                            >
                                Pay Now
                            </button>
                         </div>
                     ) : (
                         <form onSubmit={handleRazorpayFormSubmit} className="space-y-4">
                             <h3 className="font-bold text-gray-800 flex items-center"><Lock size={16} className="mr-2" /> Secure Payment</h3>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                                 <input type="text" required placeholder="0000 0000 0000 0000" className="w-full border rounded p-2 bg-white text-gray-900 text-sm" maxLength={19} />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                                     <input type="text" required placeholder="MM/YY" className="w-full border rounded p-2 bg-white text-gray-900 text-sm" />
                                 </div>
                                 <div>
                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                                     <input type="password" required placeholder="123" className="w-full border rounded p-2 bg-white text-gray-900 text-sm" maxLength={3} />
                                 </div>
                             </div>
                             <button 
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center shadow-lg mt-4"
                             >
                                {isProcessing ? <Loader className="animate-spin mr-2" /> : 'Pay ₹' + cartTotal}
                             </button>
                         </form>
                     )}
                </div>
            )}

            {/* UPI Section */}
            {selectedPaymentMethod === 'UPI' && paymentSettings.upiEnabled && (
                <form onSubmit={handleUpiSubmit} className="space-y-6">
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <QrCode size={128} className="text-gray-800 mb-4" />
                    <p className="font-mono font-bold text-lg">ponivraa@upi</p>
                    <p className="text-sm text-gray-500 mt-2 text-center">Scan QR or send to the ID above using GPay, PhonePe, or Paytm.</p>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter Transaction ID / UTR</label>
                    <input 
                        type="text" required
                        placeholder="e.g. 3245xxxxxxxx"
                        value={transactionId} onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">We verify this manually to confirm your order.</p>
                    </div>

                    <button type="submit" className="w-full bg-earth-500 text-white py-3 rounded-lg font-semibold hover:bg-earth-600">
                        Complete Order
                    </button>
                </form>
            )}

            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-500 hover:text-gray-700">
                Back to Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};