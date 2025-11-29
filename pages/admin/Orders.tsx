import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storage';
import { Order } from '../../types';
import { Search, User, Phone, MapPin, Save } from 'lucide-react';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [noteEdits, setNoteEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadedOrders = StorageService.getOrders();
    setOrders(loadedOrders);
    const initialNotes: Record<string, string> = {};
    loadedOrders.forEach(o => {
        if(o.adminNotes) initialNotes[o.id] = o.adminNotes;
    });
    setNoteEdits(initialNotes);
  }, []);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(filter.toLowerCase()) ||
    o.userDetails.phone.includes(filter) ||
    o.userDetails.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
      setDraggedOrderId(orderId);
      e.dataTransfer.effectAllowed = 'move';
      
      // Delay opacity change to ensure ghost image is captured fully opaque
      const el = e.target as HTMLElement;
      setTimeout(() => {
          el.style.opacity = '0.5';
      }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
      const el = e.target as HTMLElement;
      el.style.opacity = '1';
      setDraggedOrderId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
      e.preventDefault();
      if (!draggedOrderId) return;

      const order = orders.find(o => o.id === draggedOrderId);
      if (order && order.orderStatus !== newStatus) {
          const updatedOrder = { ...order, orderStatus: newStatus as any };
          if (['Processing', 'Shipped', 'Packed', 'Delivered'].includes(newStatus)) {
              updatedOrder.paymentStatus = 'Verified';
          }
          StorageService.updateOrder(updatedOrder);
          setOrders(StorageService.getOrders());
      }
      setDraggedOrderId(null);
  };

  const saveNote = (order: Order) => {
      const note = noteEdits[order.id];
      if (note !== undefined) {
          const updatedOrder = { ...order, adminNotes: note };
          StorageService.updateOrder(updatedOrder);
          alert('Delivery details updated!');
          setOrders(StorageService.getOrders());
      }
  };

  const getColumnStyles = (status: string) => {
    switch(status) {
      case 'Pending': return { header: 'bg-yellow-100 text-yellow-800 border-yellow-200', body: 'bg-yellow-50/50 border-yellow-100' };
      case 'Processing': return { header: 'bg-blue-100 text-blue-800 border-blue-200', body: 'bg-blue-50/50 border-blue-100' };
      case 'Shipped': return { header: 'bg-purple-100 text-purple-800 border-purple-200', body: 'bg-purple-50/50 border-purple-100' };
      case 'Delivered': return { header: 'bg-green-100 text-green-800 border-green-200', body: 'bg-green-50/50 border-green-100' };
      case 'Cancelled': return { header: 'bg-red-100 text-red-800 border-red-200', body: 'bg-red-50/50 border-red-100' };
      default: return { header: 'bg-gray-100 text-gray-800', body: 'bg-gray-50' };
    }
  };

  return (
    <div className="h-full flex flex-col min-h-[calc(100vh-120px)]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Order Board</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID, Phone..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-[1300px] h-full">
              {ORDER_STATUSES.map(status => {
                  const styles = getColumnStyles(status);
                  const columnOrders = filteredOrders.filter(o => o.orderStatus === status);
                  
                  return (
                  <div 
                    key={status}
                    className={`flex-1 min-w-[250px] rounded-xl p-4 flex flex-col h-full border ${styles.body}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                      <div className={`flex items-center justify-between mb-4 px-3 py-2 rounded-lg font-bold border shadow-sm ${styles.header}`}>
                          <span>{status}</span>
                          <span className="bg-white/60 px-2 py-0.5 rounded text-xs min-w-[24px] text-center">
                              {columnOrders.length}
                          </span>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar min-h-[100px]">
                          {columnOrders.map(order => (
                                <div 
                                    key={order.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, order.id)}
                                    onDragEnd={handleDragEnd}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono text-[10px] font-bold text-gray-500 bg-gray-100 px-1 rounded">#{order.id}</span>
                                        <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="flex items-center text-sm font-bold text-gray-800 mb-1 truncate">
                                            <User size={14} className="mr-2 text-gray-400 flex-shrink-0"/> {order.userDetails.name}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-600">
                                            <Phone size={12} className="mr-2 text-gray-400 flex-shrink-0"/> {order.userDetails.phone}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-2 mb-3">
                                        {order.items.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-xs mb-1 text-gray-600">
                                                <span className="truncate max-w-[70%]">{item.name}</span>
                                                <span className="font-mono">x{item.quantity}</span>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && <div className="text-[10px] text-gray-400 italic">+ {order.items.length - 2} more</div>}
                                        <div className="text-right font-bold text-earth-900 mt-1 text-sm">₹{order.totalAmount}</div>
                                    </div>

                                    <div className="bg-gray-50 p-2 rounded border border-gray-100 group-hover:border-primary-100 transition-colors">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Delivery Details</label>
                                        <textarea 
                                            className="w-full text-xs border border-gray-200 rounded p-1.5 mb-1 bg-white resize-none focus:ring-1 focus:ring-primary-500 min-h-[50px]"
                                            rows={2}
                                            placeholder="E.g. Sent via DTDC..."
                                            value={noteEdits[order.id] || ''}
                                            onChange={(e) => setNoteEdits(prev => ({ ...prev, [order.id]: e.target.value }))}
                                        />
                                        <button 
                                            onClick={() => saveNote(order)}
                                            className="w-full bg-white border border-gray-300 text-gray-600 text-[10px] font-bold py-1 rounded hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 flex items-center justify-center transition-colors"
                                        >
                                            <Save size={10} className="mr-1" /> Save Note
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {columnOrders.length === 0 && (
                                <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm italic">
                                    Empty
                                </div>
                            )}
                      </div>
                  </div>
              )})}
          </div>
      </div>
    </div>
  );
};