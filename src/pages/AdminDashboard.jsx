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
  RefreshCw,
  Bell,
  Search,
  Plus,
  PlusCircle,
  Eye,
  Edit,
  Trash,
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  Calendar,
  CircleUserRound,
  Star,
  Timer,
  PackageCheck,
  Hourglass
} from 'lucide-react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState(() => {
    // Restore active tab from localStorage or default to 'products'
    const savedTab = localStorage.getItem('adminActiveTab');
    return savedTab || 'products';
  });
  const [notifications, setNotifications] = useState(3);
  const [dateFilter, setDateFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrderStatus, setEditingOrderStatus] = useState(false);
  const [tempOrderStatus, setTempOrderStatus] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [tempProduct, setTempProduct] = useState(null);

  // removal mode and undo state
  const [removeMode, setRemoveMode] = useState(false);
  const [recentlyRemoved, setRecentlyRemoved] = useState(null); // {product, index}
  const [undoVisible, setUndoVisible] = useState(false);
  const [deletedProducts, setDeletedProducts] = useState(() => {
    const savedDeleted = localStorage.getItem('deletedProducts');
    return savedDeleted ? JSON.parse(savedDeleted) : [];
  });
  const undoTimer = useRef(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Track if this is initial mount to avoid scroll on refresh
  const isInitialMount = useRef(true);

  // Initialize tab from URL params first, then localStorage, then default
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    const savedTab = localStorage.getItem('adminActiveTab');
    const tab = urlTab || savedTab || 'products';
    
    console.log('Initializing tab:', { urlTab, savedTab, tab });
    setActiveTab(tab);
    setSidebarOpen(false);
    
    // Mark as initialized after setting the tab
    setTimeout(() => {
      isInitialMount.current = false;
    }, 100);
    
    // Update URL if it doesn't have the tab parameter
    if (!urlTab && tab !== 'products') {
      setSearchParams({ tab });
    }
  }, []);

  // Save active tab to localStorage and URL whenever it changes (but not on initial mount)
  useEffect(() => {
    if (!isInitialMount.current) {
      console.log('Tab changed to:', activeTab);
      localStorage.setItem('adminActiveTab', activeTab);
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, setSearchParams]);

  // Scroll to top when tab changes or on page refresh
  useEffect(() => {
    if (!isInitialMount.current) {
      window.scrollTo(0, 0);
    } else {
      // On initial mount, scroll to top after a short delay
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [activeTab]);

  // Handle browser back/forward navigation only
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== activeTab && isInitialMount.current === false) {
      setActiveTab(urlTab);
    }
  }, [location.search]);

  // localStorage helper functions
  const saveOrdersToStorage = (orders) => {
    localStorage.setItem('wigOrders', JSON.stringify(orders));
  };

  const loadOrdersFromStorage = () => {
    const stored = localStorage.getItem('wigOrders');
    return stored ? JSON.parse(stored) : null;
  };

  // Generate product description based on name with minimum 16 words
  const generateProductDescription = (productName) => {
    const descriptions = {
      'chuwudi hair': 'Premium quality human hair wig with natural texture and beautiful movement. Perfect for everyday wear with comfortable fit and long-lasting durability.',
      'grey hair wig': 'Elegant grey colored wig with sophisticated styling and premium materials. Features realistic appearance and comfortable all-day wear.',
      'premium quality wig': 'Luxury human hair wig with exceptional quality and natural appearance. Handcrafted with attention to detail for perfect styling.',
      'bone straight': 'Sleek straight hair wig with smooth texture and natural shine. Versatile styling options for any occasion or professional setting.',
      'wig of brazil': 'Authentic Brazilian human hair wig with rich texture and volume. Premium quality with natural luster and minimal shedding.',
      'curly wig': 'Beautiful curly hair wig with defined curls and natural bounce. Perfect for voluminous styling and confident appearance.',
      'glueless front wig': 'Convenient glueless wig with easy application and secure fit. No adhesive required for comfortable all-day wear.',
      'brazilian virgin hair': 'Premium Brazilian virgin hair wig with exceptional quality. Thick, full-bodied hair with natural luster and durability.',
      'peruvian straight wig': 'Silky smooth Peruvian straight hair wig with natural shine. Easy to manage with versatile styling options.',
      'malaysian body wave': 'Stunning Malaysian body wave wig with beautiful waves. Soft to touch with natural movement and lasting construction.',
      'indian remy hair': 'High-quality Indian Remy hair wig with cuticle alignment. Prevents tangling and maintains natural appearance.',
      'european human hair': 'Exceptionally soft European human hair wig with finest quality. Natural appearance with easy styling versatility.',
      'african american wig': 'Natural texture African American wig designed for perfect blend. Comfortable fit with authentic appearance.',
      'wavy human hair': 'Natural wave human hair wig with beach waves. Easy to maintain with versatile styling options.',
      'straight bob wig': 'Classic straight bob wig with professional styling. Perfect for business or casual elegant settings.',
      'short pixie cut': 'Modern short pixie cut wig with bold styling. Confident look with minimal maintenance required.',
      'long layered wig': 'Beautiful long layered wig with volume and movement. Versatile styling for any face shape.',
      'loose wave wig': 'Casual loose wave wig with soft appearance. Beach-ready style with effortless beauty.',
      'tight curl wig': 'Bouncy tight curl wig with full volume. Fun and playful personality with defined curls.',
      'kinky curly wig': 'Natural kinky curly wig with authentic texture. Bold and confident style celebrating natural beauty.',
      'afro curl wig': 'Full volume afro curl wig with bold appearance. Celebrates natural hair texture beautifully.',
      'coily wig': 'Springy coily wig with defined coils. Moisture-rich for healthy natural appearance.',
      'silk base wig': 'Premium silk base wig with undetectable hairline. Most natural-looking construction available.',
      'mono part wig': 'Realistic mono part wig with versatile styling. Professional appearance with realistic parting.',
      'hd lace closure': 'High-definition lace closure with seamless blend. Perfect for natural-looking installations.',
      'lace front wig': 'Advanced lace front technology with realistic appearance. Breathable construction for comfortable wear.'
    };

    // Convert to lowercase for matching
    const lowerName = productName.toLowerCase();
    
    // Check for exact matches first
    if (descriptions[lowerName]) {
      return descriptions[lowerName];
    }
    
    // Check for partial matches
    for (const [key, description] of Object.entries(descriptions)) {
      if (lowerName.includes(key) || key.includes(lowerName)) {
        return description;
      }
    }
    
    // Generate generic description if no match found
    const hairTypes = ['human hair', 'synthetic fiber', 'premium quality', 'luxury material'];
    const features = ['natural appearance', 'comfortable fit', 'versatile styling', 'long-lasting durability'];
    const occasions = ['everyday wear', 'special occasions', 'professional settings', 'casual outings'];
    
    const hairType = hairTypes[Math.floor(Math.random() * hairTypes.length)];
    const feature1 = features[Math.floor(Math.random() * features.length)];
    const feature2 = features[Math.floor(Math.random() * features.length)];
    const occasion = occasions[Math.floor(Math.random() * occasions.length)];
    
    return `Premium ${hairType} wig with ${feature1} and ${feature2}. Perfect for ${occasion} with exceptional quality and beautiful styling.`;
  };

  // Product editing functions
  const startEditingProduct = (product) => {
    setEditingProduct(product);
    setTempProduct({
      ...product,
      rating: product.rating || 4,
      description: product.description || generateProductDescription(product.name)
    });
  };


  // toggle removal mode on/off
  const toggleRemoveMode = () => {
    setRemoveMode(prev => !prev);
    // clear any undo info when entering/exiting mode
    setRecentlyRemoved(null);
    setUndoVisible(false);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  };

  const removeProduct = (product) => {
    // remove from list and persist
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated.splice(idx, 1);
      // persist immediately
      localStorage.setItem('wigProducts', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: updated }));
      updateProductsFile(updated);
      updateShopFile(updated);
      // store undo info
      setRecentlyRemoved({ product, index: idx });
      setUndoVisible(true);
      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => {
        setUndoVisible(false);
        setRecentlyRemoved(null);
      }, 5000);
      return updated;
    });
    
    // Add to deleted products list
    setDeletedProducts(prev => {
      const updated = [...prev, product];
      localStorage.setItem('deletedProducts', JSON.stringify(updated));
      return updated;
    });
  };

  const undoRemove = () => {
    if (!recentlyRemoved) return;
    setProducts(prev => {
      const updated = [...prev];
      const { product, index } = recentlyRemoved;
      updated.splice(index, 0, product);
      // persist immediately
      localStorage.setItem('wigProducts', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: updated }));
      updateProductsFile(updated);
      updateShopFile(updated);
      return updated;
    });
    setUndoVisible(false);
    setRecentlyRemoved(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  };

  const recoverProduct = (index) => {
    const productToRecover = deletedProducts[index];
    if (!productToRecover) return;
    
    // Add back to products list
    setProducts(prev => {
      const updated = [...prev, productToRecover];
      // persist immediately
      localStorage.setItem('wigProducts', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: updated }));
      updateProductsFile(updated);
      updateShopFile(updated);
      return updated;
    });
    
    // Remove from deleted products
    setDeletedProducts(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      localStorage.setItem('deletedProducts', JSON.stringify(updated));
      return updated;
    });
  };

  const permanentlyDeleteProduct = (index) => {
    const product = deletedProducts[index];
    if (!product) return;
    
    // Show confirmation dialog before permanent deletion
    if (window.confirm(`Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`)) {
      setDeletedProducts(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        localStorage.setItem('deletedProducts', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const saveProductChanges = () => {
    if (tempProduct) {
      // Handle position swapping
      let updatedProducts = [...products];
      const targetPosition = tempProduct.position;
      const currentProduct = updatedProducts.find(p => p.id === tempProduct.id);
      const currentProductPosition = currentProduct?.position;
      
      if (targetPosition !== undefined && targetPosition > 0 && currentProductPosition !== undefined) {
        // Find the product currently at the target position
        const productAtTargetPosition = updatedProducts.find(p => p.position === targetPosition);
        
        if (productAtTargetPosition && productAtTargetPosition.id !== tempProduct.id) {
          // Swap positions: target product gets current position, current product gets target position
          productAtTargetPosition.position = currentProductPosition;
          console.log(`Swapping positions: Product ${currentProduct.id} from ${currentProductPosition} to ${targetPosition}, Product ${productAtTargetPosition.id} from ${targetPosition} to ${currentProductPosition}`);
        } else {
          console.log(`Moving Product ${currentProduct.id} from ${currentProductPosition} to ${targetPosition} (no swap needed)`);
        }
      }
      
      // Update the current product with new position
      updatedProducts = updatedProducts.map(p => 
        p.id === tempProduct.id ? { ...tempProduct, position: targetPosition } : p
      );
      
      // Sort products by position
      updatedProducts.sort((a, b) => {
        const aPos = a.position !== undefined ? a.position : 999;
        const bPos = b.position !== undefined ? b.position : 999;
        return aPos - bPos;
      });
      
      setProducts(updatedProducts);
      
      // Save to localStorage for persistence
      localStorage.setItem('wigProducts', JSON.stringify(updatedProducts));
      
      // Dispatch custom event to notify Shop.jsx immediately
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: updatedProducts }));
      
      // Update products.js file dynamically
      updateProductsFile(updatedProducts);
      
      // Update shop.jsx with new product data
      updateShopFile(updatedProducts);
      
      // Close edit modal
      setEditingProduct(null);
      setTempProduct(null);
    }
  };

  // Update products.js file with new product data
  const updateProductsFile = (updatedProducts) => {
    try {
      // Create the products array format for products.js
      const productsForFile = updatedProducts.map(product => ({
        id: product.id,
        title: product.name, // Use the actual edited name
        price: product.price,
        image: product.image,
        images: [product.image, product.image], // Add multiple images if available
        rating: product.rating || 4,
        soldOut: product.status === 'out-of-stock'
      }));
      
      // Generate the products.js content with actual product names
      const productsJSContent = `// Use wig images for products
${Array.from({length: 36}, (_, i) => `import wig${i + 1} from '../assets/wig${i + 1}.jpeg'`).join('\n')}

export const products = ${JSON.stringify(productsForFile, null, 2)};

export default products;`;
      
      // In a real app, you'd use a file system API
      // For now, save to localStorage as backup
      localStorage.setItem('productsJSContent', productsJSContent);
      console.log('Products file updated with edited product names');
      
    } catch (error) {
      console.error('Error updating products.js:', error);
    }
  };

  // Update shop.jsx with new product data  
  const updateShopFile = (updatedProducts) => {
    try {
      // Generate the shop.jsx content with updated products
      const shopJSContent = `import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Star, Heart, Share2, Facebook, Twitter, Instagram } from 'lucide-react';

const Shop = () => {
  const cart = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Updated products from admin changes - use actual edited names
  const [currentProducts, setCurrentProducts] = useState(() => {
    const savedProducts = localStorage.getItem('wigProducts');
    return savedProducts ? JSON.parse(savedProducts) : updatedProducts; // Use updatedProducts as fallback
  });

  useEffect(() => {
    localStorage.setItem('wigProducts', JSON.stringify(currentProducts));
  }, [currentProducts]);

  const filteredProducts = currentProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) // Use actual edited names
  );

  const categories = ['all', 'wigs', 'accessories'];
  const categoryProducts = {
    all: filteredProducts,
    wigs: filteredProducts.filter(p => p.name.toLowerCase().includes('wig')), // Use actual edited names
    accessories: filteredProducts.filter(p => !p.name.toLowerCase().includes('wig')) // Use actual edited names
  };

  const addToCart = (product) => {
    cart.addProduct(product, quantity);
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const buyNow = (product) => {
    cart.addProduct(product, quantity);
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20">
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Premium Quality Wigs
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Transform your look with our beautiful collection
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/shop"
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  to="/collections"
                  className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  View Collections
                </Link>
              </div>
            </div>
          </div>
        </div>

      {/* Updated Products Display */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-lg text-gray-600 mb-8">Discover our latest collection with real-time updates</p>
        </div>

        {currentProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name} // Use actual edited name
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3> {/* Use actual edited name */}
                  <span className="text-2xl font-bold text-purple-600">₦{product.price.toLocaleString()}</span>
                </div>
                <p className="text-gray-600 mb-4">
                  {product.description || generateProductDescription(product.name)} {/* Use actual edited name */}
                </p>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < (product.rating || 4)} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.rating || 4}/5)</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => buyNow(product)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;`;

      // Save to localStorage as backup
      localStorage.setItem('shopJSContent', shopJSContent);
      console.log('Shop file updated with edited product names');
      
    } catch (error) {
      console.error('Error updating shop.jsx:', error);
    }
  };

  const cancelProductEdit = () => {
    setEditingProduct(null);
    setTempProduct(null);
  };

  const handleProductChange = (field, value) => {
    setTempProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e, type, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'main') {
          setTempProduct(prev => ({
            ...prev,
            image: event.target.result
          }));
        } else if (type === 'modal') {
          setTempProduct(prev => {
            const modalImages = [...(prev.modalImages || [])];
            modalImages[index] = event.target.result;
            return {
              ...prev,
              modalImages
            };
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeModalImage = (index) => {
    setTempProduct(prev => {
      const modalImages = [...(prev.modalImages || [])];
      modalImages[index] = null;
      return {
        ...prev,
        modalImages
      };
    });
  };

  // Mock data
  const [stats, setStats] = useState({
    totalRevenue: 2456789,
    totalOrders: 1234,
    totalCustomers: 892,
    totalProducts: 156,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2,
    productGrowth: 5.7,
    // Time-based order counts
    todayOrders: 34,
    yesterdayOrders: 28,
    weekOrders: 156,
    monthOrders: 678,
    allOrders: 2300
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

  const initialProducts = allProducts.map((product, index) => ({
    id: product.id,
    name: product.title,
    price: product.price,
    rating: product.rating || 4,
    description: generateProductDescription(product.title),
    stock: Math.floor(Math.random() * 100) + 1, // Random stock between 1-100
    category: product.title.includes('Wig') ? 'Human Hair' : 'Accessories',
    status: product.soldOut ? 'out-of-stock' : (Math.random() > 0.8 ? 'low-stock' : 'active'),
    image: product.image,
    position: index + 1 // Set position based on array order (1, 2, 3, 4...)
  }));

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('wigProducts');
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      // Sort by position to ensure correct order
      parsed.sort((a, b) => {
        const aPos = a.position !== undefined ? a.position : 999;
        const bPos = b.position !== undefined ? b.position : 999;
        return aPos - bPos;
      });
      return parsed;
    }
    return initialProducts;
  });

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('wigProducts');
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      // Check if products have positions, if not, reinitialize
      const hasPositions = parsed.every(p => p.position !== undefined);
      if (!hasPositions) {
        console.log('Products missing positions, reinitializing with correct positions...');
        // Use initialProducts with proper positions
        setProducts(initialProducts);
        localStorage.setItem('wigProducts', JSON.stringify(initialProducts));
      } else {
        // Update descriptions for all products to ensure 16+ words
        const updatedProducts = parsed.map(product => ({
          ...product,
          description: product.description || generateProductDescription(product.name || product.title)
        }));
        console.log('Updated all product descriptions to 16+ words');
        setProducts(updatedProducts);
        localStorage.setItem('wigProducts', JSON.stringify(updatedProducts));
      }
    } else {
      // No saved products, use initial with proper positions
      setProducts(initialProducts);
      localStorage.setItem('wigProducts', JSON.stringify(initialProducts));
    }
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'products', label: 'Products', icon: ProductIcon },
    { id: 'orders', label: 'Orders', icon: OrderIcon },
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
        icon: Timer,
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200',
        label: 'Processing'
      },
      shipped: {
        icon: PackageCheck,
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200',
        label: 'Shipped'
      },
      pending: {
        icon: Hourglass,
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200',
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

  // Get order count based on time filter
  const getOrderCountByTimeFilter = (filter) => {
    switch (filter) {
      case 'today': return stats.todayOrders;
      case 'yesterday': return stats.yesterdayOrders;
      case 'week': return stats.weekOrders;
      case 'month': return stats.monthOrders;
      case 'all': return stats.allOrders;
      default: return stats.todayOrders;
    }
  };

  // Get title based on time filter
  const getOrdersTitleByFilter = (filter) => {
    switch (filter) {
      case 'today': return 'Total Orders ( Today )';
      case 'yesterday': return 'Total Orders ( Yesterday )';
      case 'week': return 'Total Orders ( Week )';
      case 'month': return 'Total Orders ( Month )';
      case 'all': return 'Total Orders';
      default: return 'Total Orders ( Today )';
    }
  };

  const StatCard = ({ title, value, icon: Icon, growth, isPositive, showDropdown, dropdownValue, onDropdownChange }) => (
    <div className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200 relative">
      {showDropdown && (
        <select 
          value={dropdownValue}
          onChange={(e) => onDropdownChange(e.target.value)}
          className="absolute top-4 right-4 text-xs px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="all">All</option>
        </select>
      )}
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
        {!showDropdown && (
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Icon size={24} className="text-gray-800" />
          </div>
        )}
      </div>
    </div>
  );

  const renderOverview = () => {
    const salesData = [
      { name: 'Jan', value: 400000 },
      { name: 'Feb', value: 300000 },
      { name: 'Mar', value: 600000 },
      { name: 'Apr', value: 800000 },
      { name: 'May', value: 500000 },
      { name: 'Jun', value: 700000 }
    ];

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={stats.totalRevenue} 
            icon={Wallet} 
            growth={stats.revenueGrowth}
            isPositive={stats.revenueGrowth > 0}
          />
          <StatCard 
            title={getOrdersTitleByFilter(timeFilter)}
            value={getOrderCountByTimeFilter(timeFilter)}
            icon={ClockArrowDown} 
            growth={stats.orderGrowth}
            isPositive={stats.orderGrowth > 0}
            showDropdown={true}
            dropdownValue={timeFilter}
            onDropdownChange={setTimeFilter}
          />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <AnalyticsChart 
              data={salesData} 
              type="bar" 
              title="Monthly Revenue" 
            />
          </div>
        </div>
      </div>
    );
  };

  const renderProducts = () => {
    const regenerateDescriptions = () => {
      const updatedProducts = products.map(product => ({
        ...product,
        description: generateProductDescription(product.name || product.title)
      }));
      console.log('Manually regenerated all product descriptions to 16+ words');
      setProducts(updatedProducts);
      localStorage.setItem('wigProducts', JSON.stringify(updatedProducts));
    };

    // Pagination for products
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxVisiblePages = 4;
      
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      return pageNumbers;
    };

    return (
      <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col gap-2 max-w-xs mx-auto">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200 shadow-sm">
              <PlusCircle size={14} />
              <span className="text-xs">Add Product</span>
            </button>
            <button
              onClick={toggleRemoveMode}
              className={`${removeMode ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'} px-2 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200 shadow-sm`}
            >
              <Trash size={14} />
              <span className="text-xs">{removeMode ? 'Done' : 'Remove Products'}</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                {removeMode ? (
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remove</th>
                ) : (
                  <>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Edit</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-2 py-4">
                    <div className="flex items-center space-x-2 min-w-0">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <span className="font-medium text-xs sm:text-sm truncate" title={product.name}>{product.name}</span>
                    </div>
                  </td>
                  {removeMode ? (
                    <td className="px-2 py-4">
                      <button
                        onClick={() => removeProduct(product)}
                        className="text-red-600 hover:text-red-800 font-medium text-xs sm:text-sm flex items-center space-x-1"
                      >
                        <Trash size={14} />
                        <span>Remove</span>
                      </button>
                    </td>
                  ) : (
                    <>
                      <td className="px-2 py-4 text-xs sm:text-sm">₦{product.price.toLocaleString()}</td>
                      <td className="px-2 py-4">
                        <button
                          onClick={() => startEditingProduct(product)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Products Pagination */}
        {/* undo notification */}
        {undoVisible && recentlyRemoved && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-3 shadow-lg">
            <span>Removed {recentlyRemoved.product.name}</span>
            <button onClick={undoRemove} className="text-blue-300 underline text-xs">Undo</button>
          </div>
        )}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-3 py-3 sm:px-4 sm:py-3 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 text-sm font-medium rounded-xl transition-colors border ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100 border-gray-300'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-blue-500 border-gray-300 bg-white'
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`w-10 h-10 text-sm font-medium rounded-xl transition-colors flex items-center justify-center ${
                      currentPage === pageNumber
                        ? 'bg-blue-400 text-white border-blue-400'
                        : 'bg-white hover:bg-blue-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 text-sm font-medium rounded-xl transition-colors border ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100 border-gray-300'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-blue-500 border-gray-300 bg-white'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Recently Deleted Section */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Trash2 size={16} />
            Recently Deleted
          </h3>
          <span className="text-xs text-gray-500">
            {deletedProducts?.length || 0} items
          </span>
        </div>
        
        {deletedProducts && deletedProducts.length > 0 ? (
          <div className="space-y-2">
            {deletedProducts.map((product, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={product.image || '/placeholder.jpg'} 
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover border border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => recoverProduct(index)}
                    className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-md hover:bg-green-200 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw size={12} />
                    Recover
                  </button>
                  <button
                    onClick={() => permanentlyDeleteProduct(index)}
                    className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-md hover:bg-red-200 transition-colors flex items-center gap-1"
                    title="Permanently delete (cannot be undone)"
                  >
                    <Trash size={12} />
                    Delete Forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No recently deleted items
          </p>
        )}
      </div>
    </>
    );
  };

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
                      <StatusIcon className={`w-3.5 h-3.5 text-gray-800`} />
                      <span className={`text-xs font-medium text-gray-800`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button onClick={() => setSelectedOrder(order)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors">
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
            <div className="flex items-center justify-center gap-2">
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
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`w-10 h-10 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

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
        <div className="fixed inset-0 bg-black/30" onClick={() => setSelectedOrder(null)}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full h-full max-w-full border border-gray-100 overflow-y-auto">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 sticky top-0 z-20">
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
                              className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500"
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
                    className="px-4 py-2 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors font-medium text-sm"
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

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <AnalyticsChart 
            data={salesData} 
            type="bar" 
            title="Monthly Revenue" 
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    console.log('Rendering content for tab:', activeTab);
    try {
      // Always render components, but hide them with CSS when not active
      return (
        <div>
          <div style={{ display: activeTab === 'overview' ? 'block' : 'none' }}>
            {renderOverview()}
          </div>
          <div style={{ display: activeTab === 'products' ? 'block' : 'none' }}>
            {renderProducts()}
          </div>
          <div style={{ display: activeTab === 'orders' ? 'block' : 'none' }}>
            {renderOrders()}
          </div>
          <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
            <Settings key="settings" />
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering content for tab:', activeTab, error);
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-lg font-semibold mb-4">Error Loading Content</h3>
          <p className="text-gray-600">There was an error loading the {activeTab} content. Please try refreshing the page.</p>
          <button 
            onClick={() => setActiveTab('overview')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Overview
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-14 font-sans" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent">
            Vendor Dashboard
          </h1>
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
                  console.log('Navigation clicked:', item.id);
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                  setSearchParams({ tab: item.id });
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md transform scale-105 border border-gray-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                }`}
              >
                <Icon size={18} className="mr-4 flex-shrink-0" />
                <span className="text-left">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-6 bg-gray-800 rounded-r-full"></div>
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
              <Link to="#/shop" className="inline-flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-1 sm:mr-4 mr-7"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Store clicked, navigating to shop...');
                        window.location.href = '#/shop';
                      }}>
                <Store size={12} className="mr-2 sm:mr-4" />
                <span>Back to Store</span>
              </Link>
              
              <ProfileDropdown
                userName="Enoch Chukwudi"
                userEmail="zinnyhairs@gmail.com"
                userImage={adminIcon}
                notificationCount={notifications}
                showNotifications={true}
                onMyStoreClick={() => setActiveTab('overview')}
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

        {/* Product Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-0 overflow-y-auto" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
            {/* dim background always clickable to close */}
            <div className="fixed inset-0 bg-black/30" onClick={cancelProductEdit}></div>
            {/* fullscreen white panel */}
            <div className="relative bg-white w-full h-full overflow-y-auto border border-gray-100">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-900 font-semibold text-lg">Edit Product</span>
                    <span className="text-gray-600 font-mono text-sm">{tempProduct?.id}</span>
                  </div>
                  <button
                    onClick={cancelProductEdit}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Product Image */}
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={tempProduct?.image} 
                    alt={tempProduct?.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{tempProduct?.name}</h3>
                    <p className="text-sm text-gray-600">Current Product</p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                    <div className="flex items-center space-x-4">
                      <img 
                        src={tempProduct?.image || '/placeholder.jpg'} 
                        alt="Main product"
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      />
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'main')}
                          className="hidden"
                          id="main-image-upload"
                        />
                        <label
                          htmlFor="main-image-upload"
                          className="cursor-pointer bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                        >
                          Change Main Image
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Modal Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Images (Max 5)</label>
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                      {[...Array(5)].map((_, index) => {
                        const modalImage = tempProduct?.modalImages?.[index];
                        return (
                          <div key={index} className="flex-shrink-0 flex flex-col items-center">
                            {modalImage ? (
                              <>
                                <div className="relative">
                                  <img 
                                    src={modalImage} 
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-20 rounded-lg object-cover border border-gray-200"
                                  />
                                  {/* always-visible delete overlay */}
                                  <button
                                    type="button"
                                    onClick={() => removeModalImage(index)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                                    aria-label="Remove thumbnail"
                                  >
                                    ×
                                  </button>
                                </div>
                                {/* secondary remove link below thumbnail */}
                                <button
                                  type="button"
                                  onClick={() => removeModalImage(index)}
                                  className="mt-1 text-xs text-red-600 hover:underline"
                                >
                                  Remove
                                </button>
                              </>
                            ) : (
                              <div className="w-full h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, 'modal', index)}
                                  className="hidden"
                                  id={`modal-image-${index}`}
                                />
                                <label
                                  htmlFor={`modal-image-${index}`}
                                  className="cursor-pointer text-gray-400 hover:text-gray-600 text-xs text-center"
                                >
                                  <div>+</div>
                                  <div>Thumb</div>
                                </label>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Upload thumbnail images for product gallery. If you upload 2 images, exactly 2 will show. If 3, exactly 3 will show, etc.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={tempProduct?.name || ''}
                      onChange={(e) => handleProductChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Position (Current: {tempProduct?.position || 'Not set'})
                    </label>
                    <input
                      type="number"
                      value={tempProduct?.position || ''}
                      onChange={(e) => handleProductChange('position', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new position number"
                      min="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Note: This will swap positions with the product currently at this position
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (NGN)</label>
                    <input
                      type="number"
                      value={tempProduct?.price || ''}
                      onChange={(e) => handleProductChange('price', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={tempProduct?.rating || 4.0}
                      onChange={(e) => handleProductChange('rating', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={4.0}>4.0 - Good</option>
                      <option value={4.1}>4.1 - Good</option>
                      <option value={4.2}>4.2 - Good</option>
                      <option value={4.3}>4.3 - Good</option>
                      <option value={4.4}>4.4 - Good</option>
                      <option value={4.5}>4.5 - Good</option>
                      <option value={4.6}>4.6 - Good</option>
                      <option value={4.7}>4.7 - Good</option>
                      <option value={4.8}>4.8 - Good</option>
                      <option value={4.9}>4.9 - Good</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={tempProduct?.description || ''}
                      onChange={(e) => handleProductChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={cancelProductEdit}
                    className="px-6 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveProductChanges}
                    className="px-6 py-2.5 bg-green-500 text-white rounded-lg border border-green-500 hover:bg-green-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
