import { Menu, X, Home, ShoppingCart, Layers, HelpCircle, CreditCard, Search, User, Settings, HelpCircle as HelpIcon, LogOut, ArrowLeft, Info, Store, Bell } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/wig.png';
import shopwigsIcon from '../assets/shopwigs.png';
import accessIcon from '../assets/access.png';
import cardIcon from '../assets/card.png';
import homeIcon from '../assets/home.png';
import hamburgerIcon from '../assets/hamburger.png';
import adminIcon from '../assets/admin.png';
import { useCart } from '../context/CartContext'
import { createPortal } from 'react-dom'
import { products, accessoryProducts } from '../data/products'
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cart = useCart();
  
  // Check if user is authenticated
  const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';


  // Custom icon components
  const ShopWigsIcon = () => (
    <img src={shopwigsIcon} alt="Shop Wigs" className="w-8 h-8" />
  );

  const AccessoriesIcon = () => (
    <img src={accessIcon} alt="Accessories" className="w-8 h-8" />
  );

  const CardIcon = () => (
    <img src={cardIcon} alt="Checkout" className="w-8 h-8" />
  );

  const HomeIcon = () => (
    <img src={homeIcon} alt="Home" className="ml-2 w-6 h-6" />
  );

  const HamburgerIcon = () => (
    <img src={hamburgerIcon} alt="Menu" className="ml-3 w-8 h-8" />
  );

  // SearchOverlay component
  function SearchOverlay() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const searchRef = useRef(null)

    const onChange = (e) => {
      const v = e.target.value
      setQuery(v)
      const q = String(v || '').trim().toLowerCase()
      if (!q) {
        setResults([])
        return
      }
      const allProducts = [...products, ...accessoryProducts]
      const filtered = allProducts.filter(p => String(p.title || '').toLowerCase().includes(q)).slice(0, 6)
      setResults(filtered)
    }

    const onSelect = (p) => {
      setQuery('')
      setResults([])
      setShowSearchOverlay(false)
      navigate(`/product/${p.id}`)
    }

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === 'Escape') {
          setShowSearchOverlay(false)
        }
      }
      document.addEventListener('keydown', onKey)
      return () => {
        document.removeEventListener('keydown', onKey)
      }
    }, [])

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-md"
          onClick={() => setShowSearchOverlay(false)}
        />
        <div className="relative w-full max-w-lg mx-4">
          <div className="bg-gray-100 rounded-lg flex items-center px-4 py-3 shadow-lg">
            <Search size={20} className="text-gray-500 mr-3" />
            <input
              ref={searchRef}
              value={query}
              onChange={onChange}
              className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-500"
              placeholder="Search"
              autoFocus
            />
            <button 
              onClick={() => setShowSearchOverlay(false)}
              className="ml-3 text-blue-500 font-medium hover:text-blue-600"
            >
              Cancel
            </button>
          </div>
          {results && results.length > 0 && (
            <div className="mt-2 bg-white rounded-lg shadow-lg max-h-64 overflow-auto">
              {results.map(r => (
                <button key={r.id} onClick={() => onSelect(r)} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50">
                  <img src={r.image} alt={r.title} className="w-12 h-12 object-cover rounded" width="48" height="48" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-800">{r.title}</div>
                    <div className="text-xs text-gray-500">NGN {Number(r.price).toLocaleString()}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
  const mobileNavItems = [
    { path: '/home', label: 'Home', Icon: HomeIcon },
    { path: '/shop', label: 'Shop Wigs', Icon: ShopWigsIcon },
    { path: '/collections', label: 'Accessories', Icon: AccessoriesIcon },
    { path: '/checkout', label: 'Checkout', Icon: CardIcon },
    { path: '/faq', label: 'Help', Icon: HelpCircle },
  ];

  return (
    <>
      {showSearchOverlay && <SearchOverlay />}
      
      <header
        className="fixed top-0 left-0 right-0 z-40 w-full text-black font-semibold pt-5"
        style={{
          backgroundColor: 'white',
        }}
      >
        <div className="relative max-w-7xl mx-auto px-3 py-2 flex justify-between items-center md:px-20">
          <div className="flex items-center md:hidden z-20">
            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen} aria-controls="mobile-menu" className="p-1">
              <HamburgerIcon />
            </button>

            {/* Mobile Search Icon - Show only on mobile, right next to hamburger */}
            <button 
              onClick={() => setShowSearchOverlay(true)}
              className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 ml-2"
              aria-label="Search"
            >
              <Search size={18} className="text-gray-600" strokeWidth={1.5} />
            </button>
          </div>

          {/* Desktop Menu Toggle */}
          <button className="hidden md:block z-20" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen} aria-controls="mobile-menu">
            <HamburgerIcon />
          </button>

          {/* Logo - Centered */}
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate('/');
            }}
            className="flex items-center absolute left-1/2 transform -translate-x-1/2 z-10 bg-transparent border-none cursor-pointer"
          >
            <img src={logo} alt="Logo" className="h-10 w-auto" width="40" height="40" loading="eager" fetchPriority="high" decoding="sync" style={{objectFit: 'contain'}} />
          </button>

          {/* Right side icons */}
          <div className="flex items-center gap-4 z-20">
            {/* Search Icon - Hide on mobile (shown above) */}
            <button 
              onClick={() => setShowSearchOverlay(true)}
              className="hidden md:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100"
              aria-label="Search"
            >
              <Search size={20} className="text-gray-600" strokeWidth={1.5} />
            </button>

            {/* Cart Icon - Hide in admin mode */}
            {!location.pathname.includes('/myadmin') && (
              <button 
                onClick={(e) => { e.preventDefault(); navigate('/checkout'); }} 
                className="flex items-center relative"
                aria-label="Go to checkout"
              >
                <div className="relative inline-flex items-center justify-center h-10 w-8 rounded-full hover:bg-gray-100">
                  <ShoppingCart size={18} className="text-gray-600" strokeWidth={1.5} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cart.count || 0}</span>
                </div>
              </button>
            )}

            {/* Admin Link - Show in admin mode */}
            {location.pathname.includes('/myadmin') && (
              <ProfileDropdown
                userName="Enoch Chukwudi"
                userEmail="zinnyhairs@gmail.com"
                userImage={adminIcon}
                showNotifications={false}
                onMyStoreClick={() => navigate('/myadmin')}
                onSettingsClick={() => navigate('/myadmin?tab=settings')}
                onSupportClick={() => {
                  window.location.href = `https://wa.me/2349162919586?text=${encodeURIComponent("Enoch Chukwudi\n(Business Owner)\nIndustry: Beauty & Personal Care\nBusiness name: Zinny Hairs\nUser ID: 675-31\nOwerri, Imo State, Nigeria\nReason: ")}`;
                }}
                onSignOutClick={() => {
                  sessionStorage.removeItem('isAdminAuthenticated');
                  navigate('/');
                }}
              />
            )}

            {/* Admin Link - Show in store mode */}
            {!location.pathname.includes('/myadmin') && (
              <ProfileDropdown
                userName="Enoch Chukwudi"
                userEmail="zinnyhairs@gmail.com"
                userImage={adminIcon}
                showNotifications={false}
                onMyStoreClick={() => navigate('/myadmin')}
                onSettingsClick={() => navigate('/myadmin?tab=settings')}
                onSupportClick={() => {
                  window.location.href = `https://wa.me/2349162919586?text=${encodeURIComponent("Enoch Chukwudi\n(Business Owner)\nIndustry: Beauty & Personal Care\nBusiness name: Zinny Hairs\nUser ID: 675-31\nOwerri, Imo State, Nigeria\nReason: ")}`;
                }}
                onSignOutClick={() => {
                  sessionStorage.removeItem('isAdminAuthenticated');
                  navigate('/');
                }}
              />
            )}

            {/* Admin Dashboard Link - Only show on admin route */}
            {location.pathname === '/admin' && (
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  sessionStorage.removeItem('isAdminAuthenticated'); // Clear session
                  navigate('/'); // Go to store instead of login
                }} 
                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100"
                aria-label="Logout from admin"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <img 
                    src={adminIcon} 
                    alt="Admin Avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-0 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto bg-black/20 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsOpen(false)}
          aria-hidden={!isOpen}
          style={{ backdropFilter: isOpen ? 'blur(6px)' : 'none' }}
        />

        <nav
          id="mobile-menu"
          className={`md:hidden fixed top-0 left-0 h-full w-57 pt-6 rounded-r-2xl shadow-lg transform origin-left transition-transform duration-600 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-40 flex flex-col`}
          aria-hidden={!isOpen}
          role="navigation"
          style={{ backgroundColor: 'white' }}
        >
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <button 
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate('/');
              }}
              className="flex items-center gap-3 bg-transparent border-none cursor-pointer"
            >
              <img src={logo} alt="Logo" className="h-10 w-auto mb-3" width="40" height="40" loading="eager" fetchPriority="high" decoding="sync" style={{objectFit: 'contain'}} />
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="divide-y divide-gray-100">
              {mobileNavItems.map(({ path, label, Icon }) => {
                return (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => `flex items-center gap-4 px-6 py-4 text-gray-800 hover:bg-gray-50 ${isActive ? 'bg-emerald-950/8 text-red-900 rounded-r-full' : ''}`}
                  >
                    <div className="relative">
                      <Icon size={18} className={`text-gray-600 ${path === '/faq' ? 'ml-2' : ''}`} />
                      {path === '/checkout' && cart.count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cart.count}</span>
                      )}
                    </div>
                    <span>{label}</span>
                  </NavLink>
                );
              })}
            </div>

          </div>
        </nav>

        {/* Collections modal */}
        {showCollections && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowCollections(false)} aria-hidden="true" />

            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 z-10 p-6" role="dialog" aria-modal="true" aria-labelledby="collections-title">
              <div className="flex justify-between items-start">
                <div className="text-center w-full">
                  <h2 id="collections-title" className="text-xl font-bold">Coming Soon</h2>
                  <p className="text-sm text-gray-600 mt-2">We're working on something amazing. Stay tuned</p>
                </div>
                <button onClick={() => setShowCollections(false)} className="text-gray-500 hover:text-gray-700 ml-4" aria-label="Close">
                  <X />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
