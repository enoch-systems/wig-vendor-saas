import React, { useState } from 'react';
import { Package, PackageOpen, CheckCircle, Clock, Truck, AlertCircle, ChevronDown, X, Calendar, ShoppingCart, CircleUserRound } from 'lucide-react';

const RecentOrders = ({ setActiveTab }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrderStatus, setEditingOrderStatus] = useState(false);
  const [tempOrderStatus, setTempOrderStatus] = useState('');

  // localStorage helper functions
  const saveOrdersToStorage = (orders) => {
    localStorage.setItem('wigOrders', JSON.stringify(orders));
  };

  const loadOrdersFromStorage = () => {
    const stored = localStorage.getItem('wigOrders');
    return stored ? JSON.parse(stored) : null;
  };

  // Default orders data
  const defaultOrders = [
    { id: 'ORD-001', customer: 'Sarah Johnson', phone: '+234 801 234 5678', address: '123 Lagos Street, Lagos, Nigeria', productName: 'Luxury Human Hair Wig', amount: 45999, status: 'delivered', date: '2024-01-15', time: '14:30', items: ['Bone straight', 'Wig of brazil', 'Curly wig'] },
    { id: 'ORD-002', customer: 'Michael Brown', phone: '+234 802 345 6789', address: '456 Abuja Road, Abuja, Nigeria', productName: 'Lace Front Wig', amount: 32999, status: 'processing', date: '2024-01-15', time: '10:15', items: ['Bone straight', 'Wig of brazil'] },
    { id: 'ORD-003', customer: 'Emily Davis', phone: '+234 803 456 7890', address: '789 Port Harcourt Ave, Port Harcourt, Nigeria', productName: 'Glueless Front Wig', amount: 28999, status: 'shipped', date: '2024-01-14', time: '16:45', items: ['Glueless Front Wig'] },
    { id: 'ORD-004', customer: 'James Wilson', phone: '+234 804 567 8901', address: '321 Owerri Blvd, Owerri, Nigeria', productName: 'Brazilian Virgin Hair', amount: 54999, status: 'pending', date: '2024-01-14', time: '09:20', items: ['Brazilian Virgin Hair 1', 'Brazilian Virgin Hair 2', 'Brazilian Virgin Hair 3', 'Brazilian Virgin Hair 4'] },
    { id: 'ORD-005', customer: 'Lisa An', phone: '+234 805 678 9012', address: '654 Kano Lane, Kano, Nigeria', productName: 'HD Lace Closure', amount: 18999, status: 'delivered', date: '2024-01-13', time: '13:10', items: ['HD Lace Closure 1', 'HD Lace Closure 2'] }
  ];

  const [orders, setOrders] = useState(() => {
    const storedOrders = loadOrdersFromStorage();
    return storedOrders || defaultOrders;
  });

  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
        label: 'Delivered'
      },
      processing: {
        icon: Clock,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-200',
        label: 'Processing'
      },
      shipped: {
        icon: Truck,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-200',
        label: 'Shipped'
      },
      pending: {
        icon: AlertCircle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100',
        borderColor: 'border-amber-200',
        label: 'Pending'
      }
    };
    return configs[status] || configs.pending;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <PackageOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Recent Orders</h2>
              <p className="text-xs text-gray-600 hidden sm:block">Track and manage your latest orders</p>
            </div>
          </div>
        </div>

        {/* Card Layout - matching screenshot style */}
        <div className="p-4 space-y-3">
          {orders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div 
                key={order.id} 
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      {order.id}
                    </span>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                    <span className={`text-xs font-medium ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-medium">Customer:</span>
                    <span className="ml-2 text-gray-900">{order.customer}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-medium">Amount:</span>
                    <span className="ml-2 text-gray-900 font-bold">{formatCurrency(order.amount)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-medium">Items:</span>
                    <span className="ml-2 text-gray-900">{order.items.length}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-medium">Date:</span>
                    <span className="ml-2 text-gray-900">{order.date}</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button onClick={() => setSelectedOrder(order)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors">
                    View order details
                    <ChevronDown size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 sm:px-4 sm:py-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              Showing <span className="font-semibold">5</span> recent orders
            </p>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
            >
              View all orders →
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <div className="fixed inset-0 bg-black/30 sm:hidden" onClick={() => setSelectedOrder(null)}></div>
          <div className="fixed inset-0 sm:relative bg-white rounded-xl shadow-xl w-full max-w-3xl border border-gray-100 sm:my-4 sm:mx-auto sm:max-h-[calc(100vh-2rem)] sm:overflow-y-auto pt-30 sm:pt-0">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-900 font-semibold text-lg">Order Details</span>
                  <span className="text-gray-600 font-mono text-sm">{selectedOrder.id}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Order Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-16">Name:</span>
                      <span className="text-gray-900 font-medium">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-16">Phone:</span>
                      <span className="text-gray-900 font-medium">{selectedOrder.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 w-16">Address:</span>
                      <span className="text-gray-900 font-medium text-sm">{selectedOrder.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Product</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Items</p>
                      <ol className="list-decimal list-inside text-sm text-gray-900 mt-1 space-y-1">
                        {selectedOrder.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                      <p className="font-bold text-gray-900 text-lg mt-1">{formatCurrency(selectedOrder.amount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Row */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-50 rounded flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                      <p className="font-semibold text-gray-900 text-sm">{selectedOrder.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-50 rounded flex items-center justify-center">
                      <Clock className="w-3 h-3 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                      <p className="font-semibold text-gray-900 text-sm">{formatTime(selectedOrder.time)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-50 rounded flex items-center justify-center">
                      <AlertCircle className="w-3 h-3 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                      {editingOrderStatus ? (
                        <div className="mt-2 space-y-2">
                          {['pending', 'shipped', 'delivered'].map((status) => (
                            <label key={status} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="orderStatus"
                                value={status}
                                checked={tempOrderStatus === status}
                                onChange={(e) => setTempOrderStatus(e.target.value)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className={`text-sm font-medium capitalize ${getStatusConfig(status).color}`}>
                                {getStatusConfig(status).label}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusConfig(selectedOrder.status).bgColor} ${getStatusConfig(selectedOrder.status).borderColor}`}>
                          {React.createElement(getStatusConfig(selectedOrder.status).icon, { className: `w-4 h-4 ${getStatusConfig(selectedOrder.status).color}` })}
                          <span className={`text-xs font-medium ${getStatusConfig(selectedOrder.status).color}`}>{getStatusConfig(selectedOrder.status).label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                {editingOrderStatus ? (
                  <>
                    <button 
                      onClick={() => {
                        setEditingOrderStatus(false);
                        setTempOrderStatus('');
                      }}
                      className="px-6 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        // Update the order status in the orders array
                        const updatedOrders = orders.map(order => 
                          order.id === selectedOrder.id 
                            ? { ...order, status: tempOrderStatus }
                            : order
                        );
                        setOrders(updatedOrders);
                        // Save to localStorage for persistence
                        saveOrdersToStorage(updatedOrders);
                        // Update the selected order as well
                        setSelectedOrder(prev => ({ ...prev, status: tempOrderStatus }));
                        // Reset editing state
                        setEditingOrderStatus(false);
                        setTempOrderStatus('');
                      }}
                      className="px-6 py-2.5 bg-green-600 text-white rounded-lg border border-green-600 hover:bg-green-700 transition-colors font-medium"
                    >
                      Save Status
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="px-6 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Close
                    </button>
                    <button 
                      onClick={() => {
                        setEditingOrderStatus(true);
                        setTempOrderStatus(selectedOrder.status);
                      }}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      Update Order
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
