import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Menu,
  X,
  Home,
  Package as ProductIcon,
  ShoppingCart as OrderIcon,
  Users as CustomerIcon,
  DollarSign as FinanceIcon,
  BarChart2 as AnalyticsIcon,
  Settings as SettingsIcon,
  LogOut,
  ArrowLeft,
  Bell,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Check,
  CheckCircle,
  X as CloseIcon,
  Clock,
  Truck,
  AlertCircle,
  Receipt,
  PackageOpen,
  UserCheck,
  Wallet,
  ClockArrowDown,
  ShoppingBasket,
  Store,
  ChevronDown,
  Info,
  Calendar,
  CircleUserRound
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AnalyticsChart from '../components/admin/AnalyticsChart';
import CustomerManagement from '../components/admin/CustomerManagement';
import Settings from '../components/admin/Settings';
import RecentOrders from '../components/RecentOrders';
import adminIcon from '../assets/admin.png';
import { products as allProducts } from '../data/products.js';
import ProfileDropdown from '../components/ProfileDropdown';

const AdminDashboard = () => {
  const mainContentRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrderStatus, setEditingOrderStatus] = useState(false);
  const [tempOrderStatus, setTempOrderStatus] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // localStorage helper functions
  const saveOrdersToStorage = (orders) => {
    localStorage.setItem('wigOrders', JSON.stringify(orders));
  };

  const loadOrdersFromStorage = () => {
    const stored = localStorage.getItem('wigOrders');
    return stored ? JSON.parse(stored) : null;
  };


  // Always ensure Overview is shown first and sidebar is closed when component mounts
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
    setSidebarOpen(false);
  }, []);

  // Scroll to top when switching to orders tab
  useEffect(() => {
    if (activeTab === 'orders' && mainContentRef.current) {
      setTimeout(() => {
        mainContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeTab]);

  // Mock data
  const [stats, setStats] = useState({
    totalRevenue: 2456789,
    totalOrders: 1234,
    totalCustomers: 892,
    totalProducts: 156,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2,
    productGrowth: 5.7
  });

  // Mock data - initialize from localStorage if available
  const defaultOrders = [
    { id: 'ORD-001', customer: 'Sarah Johnson', phone: '+234 801 234 5678', address: '123 Lagos Street, Lagos, Nigeria', productName: 'Luxury Human Hair Wig', amount: 45999, status: 'delivered', date: '2024-01-15', time: '14:30', items: ['Bone straight', 'Wig of brazil', 'Curly wig'] },
    { id: 'ORD-002', customer: 'Michael Brown', phone: '+234 802 345 6789', address: '456 Abuja Road, Abuja, Nigeria', productName: 'Lace Front Wig', amount: 32999, status: 'processing', date: '2024-01-15', time: '10:15', items: ['Bone straight', 'Wig of brazil'] },
    { id: 'ORD-003', customer: 'Emily Davis', phone: '+234 803 456 7890', address: '789 Port Harcourt Ave, Port Harcourt, Nigeria', productName: 'Glueless Front Wig', amount: 28999, status: 'shipped', date: '2024-01-14', time: '16:45', items: ['Glueless Front Wig'] },
    { id: 'ORD-004', customer: 'James Wilson', phone: '+234 804 567 8901', address: '321 Owerri Blvd, Owerri, Nigeria', productName: 'Brazilian Virgin Hair', amount: 54999, status: 'pending', date: '2024-01-14', time: '09:20', items: ['Brazilian Virgin Hair 1', 'Brazilian Virgin Hair 2', 'Brazilian Virgin Hair 3', 'Brazilian Virgin Hair 4'] },
    { id: 'ORD-005', customer: 'Lisa An', phone: '+234 805 678 9012', address: '654 Kano Lane, Kano, Nigeria', productName: 'HD Lace Closure', amount: 18999, status: 'delivered', date: '2024-01-13', time: '13:10', items: ['HD Lace Closure 1', 'HD Lace Closure 2'] },
    { id: 'ORD-022', customer: 'Olivia Green', phone: '+234 822 345 6789', address: '246 Adamawa Road, Adamawa, Nigeria', productName: 'Lace Front Wig', amount: 41999, status: 'shipped', date: '2025-02-07', time: '14:30', items: ['Lace Front Wig Item 1', 'Lace Front Wig Item 2'] },
    { id: 'ORD-023', customer: 'Ethan Baker', phone: '+234 823 456 7890', address: '357 Taraba Ave, Taraba, Nigeria', productName: 'Glueless Front Wig', amount: 34999, status: 'delivered', date: '2025-02-08', time: '09:45', items: ['Glueless Front Wig Item 1', 'Glueless Front Wig Item 2'] },
    { id: 'ORD-024', customer: 'Isabella Adams', phone: '+234 824 567 8901', address: '468 Niger Blvd, Niger, Nigeria', productName: 'Brazilian Virgin Hair', amount: 49999, status: 'processing', date: '2025-02-09', time: '15:20', items: ['Brazilian Virgin Hair Item 1', 'Brazilian Virgin Hair Item 2', 'Brazilian Virgin Hair Item 3', 'Brazilian Virgin Hair Item 4'] },
    { id: 'ORD-025', customer: 'William Nelson', phone: '+234 825 678 9012', address: '579 Kwara Lane, Kwara, Nigeria', productName: 'HD Lace Closure', amount: 29999, status: 'delivered', date: '2025-02-10', time: '11:10', items: ['HD Lace Closure Item 1'] },
    { id: 'ORD-026', customer: 'Mia Carter', phone: '+234 826 789 0123', address: '681 Osun Street, Osun, Nigeria', productName: 'Luxury Human Hair Wig', amount: 56999, status: 'shipped', date: '2025-02-11', time: '13:35', items: ['Luxury Human Hair Wig Item 1', 'Luxury Human Hair Wig Item 2', 'Luxury Human Hair Wig Item 3', 'Luxury Human Hair Wig Item 4', 'Luxury Human Hair Wig Item 5'] },
    { id: 'ORD-027', customer: 'James Mitchell', phone: '+234 827 890 1234', address: '792 Ogun Road, Ogun, Nigeria', productName: 'Lace Front Wig', amount: 38999, status: 'pending', date: '2025-02-12', time: '16:50', items: ['Lace Front Wig Item 1', 'Lace Front Wig Item 2'] },
    { id: 'ORD-028', customer: 'Charlotte Perez', phone: '+234 828 901 2345', address: '813 Ekiti Ave, Ekiti, Nigeria', productName: 'Glueless Front Wig', amount: 43999, status: 'delivered', date: '2025-02-13', time: '10:25', items: ['Glueless Front Wig Item 1', 'Glueless Front Wig Item 2', 'Glueless Front Wig Item 3'] },
    { id: 'ORD-029', customer: 'Benjamin Roberts', phone: '+234 829 012 3456', address: '924 Ondo Blvd, Ondo, Nigeria', productName: 'Brazilian Virgin Hair', amount: 31999, status: 'processing', date: '2025-02-14', time: '14:15', items: ['Brazilian Virgin Hair Item 1'] },
    { id: 'ORD-030', customer: 'Amelia Turner', phone: '+234 830 123 4567', address: '135 Lagos Island, Lagos, Nigeria', productName: 'HD Lace Closure', amount: 47999, status: 'shipped', date: '2025-02-15', time: '08:40', items: ['HD Lace Closure Item 1', 'HD Lace Closure Item 2', 'HD Lace Closure Item 3'] }
  ];

  const [recentOrders, setRecentOrders] = useState(() => {
    const storedOrders = loadOrdersFromStorage();
    return storedOrders || defaultOrders;
  });

  const [products, setProducts] = useState(() => 
  allProducts.map((product, index) => ({
    id: product.id,
    name: product.title,
    price: product.price,
    stock: Math.floor(Math.random() * 100) + 1, // Random stock between 1-100
    category: product.title.includes('Wig') ? 'Human Hair' : 'Accessories',
    status: product.soldOut ? 'out-of-stock' : (Math.random() > 0.8 ? 'low-stock' : 'active'),
    image: product.image
  }))
);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'products', label: 'Products', icon: ProductIcon },
    { id: 'orders', label: 'Orders', icon: OrderIcon },
    { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-orange-100 text-orange-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const StatCard = ({ title, value, icon: Icon, growth, isPositive }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {title.includes('Revenue') ? formatCurrency(value) : value.toLocaleString()}
          </p>
          {growth !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1">{growth}%</span>
            </div>
          )}
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <Icon size={24} className="text-blue-600" />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={stats.totalRevenue} 
          icon={Wallet} 
          growth={stats.revenueGrowth}
          isPositive={stats.revenueGrowth > 0}
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ClockArrowDown} 
          growth={stats.orderGrowth}
          isPositive={stats.orderGrowth > 0}
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalCustomers} 
          icon={Users} 
          growth={stats.customerGrowth}
          isPositive={stats.customerGrowth > 0}
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={ShoppingBasket} 
          growth={stats.productGrowth}
          isPositive={stats.productGrowth > 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <RecentOrders setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Products</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                    <span className="font-medium text-xs truncate" title={product.name}>{product.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-xs">{formatCurrency(product.price)}</td>
                <td className="px-3 py-2">
                  <div className="flex space-x-2">
                    <button className="text-green-600 hover:text-green-800">
                      <Edit size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => {
    // Reverse the orders to show newest first (ORD-030, ORD-029, etc.)
    const reversedOrders = [...recentOrders].reverse();
    
    // Calculate pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = reversedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(reversedOrders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    // Generate page numbers (max 5 visible)
    const getPageNumbers = () => {
      const pageNumbers = [];
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);
      
      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    };

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <PackageOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">All Orders</h2>
                  <p className="text-xs text-gray-600 hidden sm:block">Manage all customer orders</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {currentOrders.map((order) => {
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
                    
                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <div className="flex items-center">
                        <span className="font-medium">Date:</span>
                        <span className="ml-2 text-gray-900">{order.date.split(' ')[0]}</span>
                      </div>
                      <span className="text-gray-500">{order.date.split(' ')[1]}</span>
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

          {/* Pagination */}
          <div className="bg-gray-50 px-3 py-3 sm:px-4 sm:py-3 border-t border-gray-200">
            <div className="flex items-center justify-center gap-1">
              {/* Previous Button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                Prev
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Order Details Modal
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;
    
    return (
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
                      // Update the order status in the recentOrders array
                      const updatedOrders = recentOrders.map(order => 
                        order.id === selectedOrder.id 
                          ? { ...order, status: tempOrderStatus }
                          : order
                      );
                      setRecentOrders(updatedOrders);
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
    );
  };

  const renderAnalytics = () => {
    const salesData = [
      { name: 'Jan', value: 400000 },
      { name: 'Feb', value: 300000 },
      { name: 'Mar', value: 600000 },
      { name: 'Apr', value: 800000 },
      { name: 'May', value: 500000 },
      { name: 'Jun', value: 700000 }
    ];

    const categoryData = [
      { name: 'Human Hair', value: 45 },
      { name: 'Synthetic', value: 30 },
      { name: 'Lace Front', value: 15 },
      { name: 'Closures', value: 10 }
    ];

    const orderTrendData = [
      { name: 'Mon', value: 20 },
      { name: 'Tue', value: 35 },
      { name: 'Wed', value: 45 },
      { name: 'Thu', value: 30 },
      { name: 'Fri', value: 55 },
      { name: 'Sat', value: 40 },
      { name: 'Sun', value: 25 }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart 
            data={salesData} 
            type="bar" 
            title="Monthly Revenue" 
          />
          <AnalyticsChart 
            data={categoryData} 
            type="pie" 
            title="Sales by Category" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <div className="space-y-3">
              {products.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="text-sm">{product.name}</span>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'products': return renderProducts();
      case 'orders': return renderOrders();
      case 'customers': return <CustomerManagement />;
      case 'analytics': return renderAnalytics();
      case 'settings': return <Settings />;
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-14 font-sans" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Vendor Dashboard</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} className="mr-4 flex-shrink-0" />
                <span className="text-left">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-6 bg-blue-600 rounded-r-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-6 border-t border-gray-100">
          <button className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
            <LogOut size={18} className="mr-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 ">
        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm pt-4 z-40 lg:left-64 ">
          <div className="flex items-center justify-between px-6 py-4 ">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu size={24} />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/" className="inline-flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-1 sm:mr-4 mr-5">
                <Store size={12} className="mr-1 sm:mr-4" />
                <span>Store</span>
              </Link>
              
              <ProfileDropdown
                userName="Enoch Chukwudi"
                userEmail="zinnyhairs@gmail.com"
                userImage={adminIcon}
                notificationCount={notifications}
                showNotifications={true}
                onMyStoreClick={() => navigate('/')}
                onSettingsClick={() => setActiveTab('settings')}
                onSupportClick={() => {
                  window.location.href = `https://wa.me/2349162919586?text=${encodeURIComponent("Enoch Chukwudi\n(Business Owner)\nIndustry: Beauty & Personal Care\nBusiness name: Zinny Hairs\nUser ID: 675-31\nOwerri, Imo State, Nigeria\nReason: ")}`;
                }}
                onSignOutClick={() => {
                  sessionStorage.removeItem('isAdminAuthenticated');
                  navigate('/');
                }}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main ref={mainContentRef} className="p-6 pt-29">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
          </div>
          {renderContent()}
        </main>

        {/* Order Details Modal */}
        <OrderDetailsModal />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-transparent backdrop-blur-md blur-sm z-40 lg:hidden"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
