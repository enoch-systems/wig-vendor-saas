import React, { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { products, accessoryProducts } from '../data/products'
import { useCart } from '../context/CartContext'
import NewArrival from '../pages/NewArrival'
import Footer from '../pages/Footer'
import leftIcon from '../assets/left.svg'
import rightIcon from '../assets/right.svg'
import soldBadge from '../assets/soldout.png'
import MountReveal from '../components/MountReveal'

// Generate product description based on name with minimum 16 words
const generateProductDescription = (productName) => {
  const name = (productName || '').toLowerCase();
  
  // Dynamic description templates based on product characteristics
  const descriptionTemplates = {
    // Human hair descriptions
    humanHair: [
      `Exquisite ${productName} crafted from 100% premium human hair for unparalleled natural movement and versatility. Perfect for styling, coloring, and heat treatments just like your own hair.`,
      `Luxurious ${productName} featuring authentic human hair with natural texture and beautiful luster. Professional-grade quality ensures long-lasting performance and stunning realism.`,
      `Premium ${productName} made with carefully selected human hair for soft, silky feel and natural appearance. Ideal for daily wear with exceptional durability.`
    ],
    
    // Lace front descriptions
    laceFront: [
      `${productName} with advanced lace front technology creating the most realistic hairline imaginable. Virtually undetectable blending with your skin for seamless perfection.`,
      `Revolutionary ${productName} featuring HD lace front construction for flawless integration. Breathable, comfortable, and incredibly natural-looking from every angle.`,
      `Professional ${productName} with precision-crafted lace front for invisible hairline effect. Hand-tipped hairs create perfect density and natural growth patterns.`
    ],
    
    // Curly/wavy descriptions
    curly: [
      `Gorgeous ${productName} with defined, bouncy curls that maintain their shape beautifully. Premium fibers resist frizz and humidity for consistently perfect styling.`,
      `Stunning ${productName} featuring natural curl patterns with incredible volume and movement. Easy to maintain with long-lasting curl definition and beautiful shine.`,
      `Vibrant ${productName} with luxurious curls that cascade beautifully. Expertly crafted for realistic texture and effortless styling versatility.`
    ],
    
    // Straight descriptions
    straight: [
      `Sleek and sophisticated ${productName} with silky straight texture and brilliant shine. Smooth, manageable hair that flows naturally with beautiful movement.`,
      `Elegant ${productName} featuring bone-straight styling with premium quality fibers. Resistant to tangling and maintains perfect smoothness all day long.`,
      `Refined ${productName} with ultra-straight texture and natural luster. Professional-grade construction ensures durability and stunning visual appeal.`
    ],
    
    // Short style descriptions
    short: [
      `Chic and modern ${productName} with trendy short styling for bold, confident look. Lightweight and comfortable for effortless all-day wear.`,
      `Fashion-forward ${productName} featuring contemporary short cut with expert layering. Perfect for low-maintenance styling with high-impact visual appeal.`,
      `Sophisticated ${productName} with precision-cut short style for professional appearance. Easy to style and maintain with lasting shape.`
    ],
    
    // Long style descriptions
    long: [
      `Dramatic and glamorous ${productName} with luxurious long length for stunning visual impact. Premium quality ensures beautiful movement and natural flow.`,
      `Elegant ${productName} featuring cascading long layers with incredible volume and versatility. Perfect for creating multiple stunning hairstyles.`,
      `Show-stopping ${productName} with flowing long length and beautiful texture. Professional craftsmanship ensures durability and breathtaking appearance.`
    ],
    
    // Glueless descriptions
    glueless: [
      `Innovative ${productName} with glueless design for easy, secure application without adhesives. Comfortable fit with adjustable straps for perfect customization.`,
      `Convenient ${productName} featuring revolutionary glueless construction for hassle-free wear. Quick application and removal with secure, comfortable fit.`,
      `User-friendly ${productName} with advanced glueless technology for effortless styling. No messy adhesives needed while maintaining perfect security.`
    ],
    
    // Brazilian/ethnic descriptions
    brazilian: [
      `Authentic ${productName} with rich Brazilian hair texture and natural volume. Premium quality with beautiful luster and exceptional durability.`,
      `Luxurious ${productName} featuring genuine Brazilian hair with gorgeous body and movement. Thick, full-bodied texture for stunning visual appeal.`,
      `Exquisite ${productName} with premium Brazilian virgin hair quality. Natural luster, minimal shedding, and beautiful texture for professional results.`
    ],
    
    // Default/fallback descriptions
    default: [
      `Premium ${productName} with exceptional quality and craftsmanship. Perfect for both everyday wear and special occasions with comfortable fit.`,
      `High-quality ${productName} featuring beautiful styling and durable construction. Versatile design suitable for various occasions and preferences.`,
      `Professional ${productName} with attention to detail and premium materials. Reliable performance with beautiful appearance and comfortable wear.`
    ]
  };
  
  // Determine which category to use based on keywords
  let category = 'default';
  
  if (name.includes('human hair') || name.includes('virgin')) {
    category = 'humanHair';
  } else if (name.includes('lace') || name.includes('front')) {
    category = 'laceFront';
  } else if (name.includes('curly') || name.includes('wave') || name.includes('coily') || name.includes('kinky')) {
    category = 'curly';
  } else if (name.includes('straight') || name.includes('bob')) {
    category = 'straight';
  } else if (name.includes('short') || name.includes('pixie')) {
    category = 'short';
  } else if (name.includes('long') || name.includes('layered')) {
    category = 'long';
  } else if (name.includes('glueless') || name.includes('easy')) {
    category = 'glueless';
  } else if (name.includes('brazil') || name.includes('peruvian') || name.includes('malaysian') || name.includes('indian') || name.includes('european')) {
    category = 'brazilian';
  }
  
  // Get templates for the category and select one randomly
  const templates = descriptionTemplates[category];
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return selectedTemplate;
};

// Generate dynamic product features based on product name/type
const getProductFeatures = (product) => {
  const productName = (product?.name || product?.title || '').toLowerCase();
  
  // Feature pools for different categories
  const qualityFeatures = ['Handcrafted', 'Professional Grade', 'Salon Quality'];
  const comfortFeatures = ['Lightweight', 'Breathable Cap', 'All-Day Comfort', 'Secure Fit'];
  const appearanceFeatures = ['Natural Look', 'Soft Texture', 'Natural Movement', 'Beautiful Shine'];
  const durabilityFeatures = ['Long-lasting', 'Minimal Shedding', 'Color-Fast', 'Heat Resistant', 'Easy Maintenance'];
  const styleFeatures = ['Versatile Styling', 'Pre-styled', 'Ready to Wear', 'Tangle-Free', 'Volume Boost'];
  
  // Base features that most products should have
  let features = ['Handcrafted', 'Lightweight'];
  
  // Add features based on product name keywords
  if (productName.includes('human hair') || productName.includes('virgin')) {
    features.push('Natural Look', 'Long-lasting');
  } else if (productName.includes('synthetic') || productName.includes('fiber')) {
    features.push('Easy Maintenance', 'Color-Fast');
  }
  
  if (productName.includes('lace') || productName.includes('front')) {
    features.push('Breathable Cap', 'Secure Fit');
  }
  
  if (productName.includes('glueless') || productName.includes('easy')) {
    features.push('Secure Fit', 'Ready to Wear');
  }
  
  if (productName.includes('curly') || productName.includes('wave')) {
    features.push('Natural Movement', 'Volume Boost');
  }
  
  if (productName.includes('straight') || productName.includes('bob')) {
    features.push('Soft Texture', 'Beautiful Shine');
  }
  
  if (productName.includes('short') || productName.includes('pixie')) {
    features.push('Lightweight', 'Easy Maintenance');
  }
  
  if (productName.includes('long') || productName.includes('layered')) {
    features.push('Versatile Styling', 'Minimal Shedding');
  }
  
  // If we still don't have 4 features, add some generic ones
  while (features.length < 4) {
    const allFeatures = [...qualityFeatures, ...comfortFeatures, ...appearanceFeatures, ...durabilityFeatures, ...styleFeatures];
    const randomFeature = allFeatures[Math.floor(Math.random() * allFeatures.length)];
    if (!features.includes(randomFeature)) {
      features.push(randomFeature);
    }
  }
  
  // Return exactly 4 features
  return features.slice(0, 4);
};



function Dynamic({ product: propProduct }) {
  const { id } = useParams() || {}
  const cart = useCart()
  const navigate = useNavigate()
  
  console.log('Dynamic component mounted - ID:', id, 'Type:', typeof id)

  const product = useMemo(() => {
    console.log('Looking up product for ID:', id)
    
    if (propProduct) {
      console.log('Using propProduct:', propProduct.title)
      return propProduct
    }
    
    // Check for admin-edited products in localStorage
    const savedProducts = localStorage.getItem('wigProducts');
    let editedProductsMap = new Map();
    
    if (savedProducts) {
      try {
        const editedProducts = JSON.parse(savedProducts);
        editedProductsMap = new Map(editedProducts.map(p => [p.id, p]));
        console.log('Loaded admin-edited products:', editedProductsMap.size);
      } catch (error) {
        console.error('Error parsing saved products:', error);
      }
    }
    
    // Check if it's an accessory ID (starts with 'acc')
    if (typeof id === 'string' && id.startsWith('acc')) {
      let found = accessoryProducts.find(p => p.id === id);
      // Merge with admin-edited data if available
      if (editedProductsMap.has(id)) {
        found = { ...found, ...editedProductsMap.get(id) };
      }
      // Generate description if not present
      if (found && !found.description) {
        found.description = generateProductDescription(found.name || found.title);
      }
      // Ensure rating has a default value
      if (found && !found.rating) {
        found.rating = 4.0;
      }
      console.log('Accessory lookup result:', found?.title || 'Not found')
      return found || products[1]
    }
    
    // Check if it's a numeric accessory ID
    const productId = id ? parseInt(id, 10) : null
    if (productId && productId > 1000) {
      const accessoryId = `acc${productId - 1000}`
      let found = accessoryProducts.find(p => p.id === accessoryId);
      // Merge with admin-edited data if available
      if (editedProductsMap.has(accessoryId)) {
        found = { ...found, ...editedProductsMap.get(accessoryId) };
      }
      // Generate description if not present
      if (found && !found.description) {
        found.description = generateProductDescription(found.name || found.title);
      }
      // Ensure rating has a default value
      if (found && !found.rating) {
        found.rating = 4.0;
      }
      console.log('Numeric accessory lookup - productId:', productId, 'accessoryId:', accessoryId, 'result:', found?.title || 'Not found')
      return found || products[1]
    }
    
    // Default to shop products
    if (productId) {
      let found = products.find(p => p.id === productId);
      // Merge with admin-edited data if available
      if (editedProductsMap.has(productId)) {
        found = { ...found, ...editedProductsMap.get(productId) };
        console.log('Merged with admin data:', editedProductsMap.get(productId));
      }
      // Generate description if not present
      if (found && !found.description) {
        found.description = generateProductDescription(found.name || found.title);
      }
      // Ensure rating has a default value
      if (found && !found.rating) {
        found.rating = 4.0;
      }
      console.log('Main product lookup - productId:', productId, 'result:', found?.title || 'Not found')
      return found || products[1]
    }
    
    console.log('No valid ID found, returning default product')
    return products[1]
  }, [propProduct, id])

  // single main image only
  const [qty, setQty] = useState(1)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const toastTimer = useRef(null)
  const mainImgRef = useRef(null)
  // temporary added state for visual feedback after add-to-cart
  const [justAdded, setJustAdded] = useState(false)
  const addedTimer = useRef(null)
  const [mainSrc, setMainSrc] = useState(product?.image || '')
  const [flipMain, setFlipMain] = useState(false)
  const [selectedThumb, setSelectedThumb] = useState(0)
  // responsive thumbnail size
  const THUMB_CLASS = 'w-15 h-15 sm:w-14 sm:h-14 md:w-16 md:h-16'

  // build thumbnail list once per product using memoization
  const thumbImages = useMemo(() => {
    const imgs = []
    // Always start with the main product image as first thumbnail
    if (product?.image) {
      imgs.push(product.image)
    }
    // Add modal images if they exist (these are additional thumbnails)
    if (product?.modalImages && Array.isArray(product.modalImages)) {
      product.modalImages.forEach(img => {
        if (img && img !== product.image) {
          imgs.push(img)
        }
      })
    }
    return imgs.length > 0 ? imgs : [product?.image]
  }, [product])

  // Debug logging
  console.log('Current selectedThumb:', selectedThumb);
  console.log('Available thumbImages:', thumbImages);
  console.log('Current mainSrc:', mainSrc);

  // insert <link rel="preload" as="image"> tags ASAP so thumbnails and main image are prioritized
  useLayoutEffect(() => {
    const created = []
    const preloaders = []
    try {
      const imgs = thumbImages && thumbImages.length ? thumbImages : [product?.image]
      imgs.forEach(src => {
        if (!src) return
        if (!document.querySelector(`link[rel="preload"][href="${src}"]`)) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = src
          // hint high priority for preloads
          try { link.setAttribute('fetchpriority', 'high') } catch (e) { void e }
          document.head.appendChild(link)
          created.push(link)
        }
        // create an Image() in layout phase so the browser starts fetching immediately
        try {
          const im = new Image()
          im.decoding = 'sync'
          im.loading = 'eager'
          // set attribute as some browsers honor it on dynamically created images
          try { im.setAttribute('fetchpriority', 'high') } catch (e) { void e }
          im.src = src
          preloaders.push(im)
        } catch (err) { void err }
      })

      if (product?.image && !document.querySelector(`link[rel="preload"][href="${product.image}"]`)) {
        const mainLink = document.createElement('link')
        mainLink.rel = 'preload'
        mainLink.as = 'image'
        mainLink.href = product.image
        try { mainLink.setAttribute('fetchpriority', 'high') } catch (e) { void e }
        document.head.appendChild(mainLink)
        created.push(mainLink)
        try {
          const im = new Image()
          im.decoding = 'sync'
          im.loading = 'eager'
          try { im.setAttribute('fetchpriority', 'high') } catch (e) { void e }
          im.src = product.image
          preloaders.push(im)
        } catch (err) { void err }
      }
    } catch (err) { void err }

    return () => {
      created.forEach(l => { if (l.parentNode) l.parentNode.removeChild(l) })
      // release references
      preloaders.forEach(p => { try { p.src = '' } catch (e) {} })
    }
  }, [thumbImages])

  useEffect(() => {
    // clear timers when product changes/unmounts
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
      if (addedTimer.current) clearTimeout(addedTimer.current)
    }
  }, [product])

  // when the product changes reset the main image and active thumbnail
  useEffect(() => {
    if (product?.image) {
      setMainSrc(product.image)
      setFlipMain(false)
      setSelectedThumb(0)
    }
  }, [product])

  // preload all thumbnail sources whenever the list itself changes
  useEffect(() => {
    const imgs = thumbImages && thumbImages.length ? thumbImages : [product?.image]
    imgs.forEach(src => {
      try {
        const img = new Image()
        img.src = src
      } catch (err) { void err }
    })
  }, [thumbImages])

  const goToIndex = (idx) => {
    const i = (idx + thumbImages.length) % thumbImages.length
    const src = thumbImages[i]
    setMainSrc(src)
    setSelectedThumb(i)
    setFlipMain(false)
  }

  const prevImage = () => {
    goToIndex(selectedThumb - 1)
  }

  const nextImage = () => {
    goToIndex(selectedThumb + 1)
  }

  const handleThumbnailClick = (src, idx) => {
    console.log('thumbnail click requested', idx)
    setMainSrc(src)
    setSelectedThumb(idx)
    setFlipMain(false)
  }

  // log whenever mainSrc or selectedThumb updates for debugging
  useEffect(() => {
    console.log('thumbnail state updated', { mainSrc, selectedThumb })
  }, [mainSrc, selectedThumb])

  const handleAddToCart = () => {
    if (cart && cart.addItem) {
      cart.addItem(product, { sourceEl: mainImgRef.current, imgSrc: product.image, qty })
    }
    // visual feedback: show green "Added" button briefly
    setJustAdded(true)
    if (addedTimer.current) clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setJustAdded(false), 1500)

    setToastMsg('Added to cart')
    setToastVisible(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 1600)
  }

  const handleBuyNow = () => {
    if (cart && cart.addItem) {
      cart.addItem(product, { sourceEl: mainImgRef.current, imgSrc: product.image, qty })
    }
    // navigate to checkout after a small tick so state updates and animation can start
    setTimeout(() => navigate('/checkout'), 150)
  }

  if (!product) {
    console.log('Product not found - ID:', id, 'Final product state:', product)
    return <div className="p-6">Product not found</div>
  }

  console.log('Final product being rendered:', product?.title, 'ID:', product?.id)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:pt-25 font-inter text-[#111] px-3">
        {/* Toast */}
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${toastVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`} role="status" aria-live="polite">
          <div className="bg-black text-gray-400 px-7 py-2 text-sm rounded-md shadow">{toastMsg}</div>
        </div>
        <div className="lg:max-w-8xl mx-auto lg:px-28 py-10 px-0">
          {/* Back button */}
          <Link to="/shop" className="inline-flex items-center gap-3 px-4 py-2 rounded-md border border-gray-400 bg-black/1 text-sm font-semibold shadow-sm">← Back</Link>

          {/* Top area */}
          <div className="mt-7 lg:ml-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Image */}
            <div className="md:col-span-1 lg:col-span-1">
              <div className="relative bg-white p-0 rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {/* Main image wrapper for navigation positioning */}
                <div className="relative">
                  {/* Navigation controls - centered within main image only */}
                  <button onClick={prevImage} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-blue-300/20 rounded-full border border-gray-300 shadow-sm hover:scale-105">
                    <img src={leftIcon} alt="Previous" className="w-5 h-5" />
                  </button>

                  <button onClick={nextImage} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-blue-300/20 rounded-full border border-gray-300 shadow-sm hover:scale-105">
                    <img src={rightIcon} alt="Next" className="w-5 h-5" />
                  </button>

                  <img
                    ref={mainImgRef}
                    key={mainSrc}  // Add key to force re-render when src changes
                    src={mainSrc}
                    alt={product.title}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={(e) => {
                      try {
                        if (e.currentTarget.src !== product.image) {
                          e.currentTarget.src = product.image
                        } else {
                          e.currentTarget.style.display = 'none'
                        }
                      } catch (err) { void err }
                    }}
                    className={`w-full h-[420px] md:h-[600px] lg:h-[800px] object-cover rounded-md ${flipMain ? 'transform -scale-x-100' : ''}`}
                    style={undefined}
                  />

                  {product.soldOut && (
                    <img src={soldBadge} alt="Sold out" className="absolute top-4 right-4 w-25 h-25 pointer-events-none z-30" />
                  )}
                </div>

                {/* Thumbnails: use product.images if present, otherwise show main image */}
                <div className="p-3 bg-gray-50 border-t border-gray-200 rounded-b-md">
                  <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {thumbImages.map((src, idx) => (
                      <button
                        key={idx}
                        onMouseDown={() => handleThumbnailClick(src, idx)}
                        onTouchStart={() => handleThumbnailClick(src, idx)}
                        onClick={() => handleThumbnailClick(src, idx)}
                        className={`${THUMB_CLASS} rounded-md overflow-hidden flex-shrink-0 transition-all duration-200 ${selectedThumb === idx ? 'ring-2 ring-amber-400 border-2 border-amber-400 scale-110 shadow-lg' : 'border-2 border-gray-200 hover:border-gray-300'}`}
                        aria-label={`Show image ${idx + 1}`}>
                        <img src={src} alt={`${product.title} ${idx + 1}`} loading="eager" decoding="async" fetchPriority="high" width="80" height="80" className={`w-full h-full object-cover`} />
                      </button>
                    ))}

                    {/* Offscreen preloader images (force immediate multi-download) */}
                    <div aria-hidden="true" style={{position: 'absolute', left: -9999, top: -9999, width: 1, height: 1, overflow: 'hidden', pointerEvents: 'none'}}>
                      {thumbImages.map((s, i) => (
                        <img key={`pre-${i}`} src={s} alt="" loading="eager" decoding="sync" fetchPriority="high" width={1} height={1} style={{width: 1, height: 1}} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Title, Rating and Price */}
                <div className="mt-6 px-3">
                  <h2 className="text-base md:text-2xl font-bold tracking-widest uppercase">{product.name || product.title}</h2>
                  
                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.417 8.27L12 19.77l-7.417 4.097L6 15.597 0 9.75l8.332-1.732z"/></svg>
                      ))}
                    </div>
                    <span className="text-gray-400">({product.rating}) rating</span>
                  </div>
                  
                  <div className="md:text-2xl text-xl font-[verdana] font-medium text-[#111] mt-3">N{product.price.toLocaleString()}</div>
                </div>

                {/* Quantity Selector */}
                <div className="mt-6 px-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">QUANTITY</h3>
                  <div className="flex items-center border border-gray-300 rounded-md w-32">
                    <button 
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-l-md"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      className="w-full text-center border-l border-r border-gray-300 py-2 text-sm font-medium text-gray-700 focus:outline-none"
                      value={qty}
                      readOnly
                    />
                    <button 
                      onClick={() => setQty(q => q + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Length Selector */}
                <div className="mt-6 px-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">LENGTH</h3>
                  <div className="flex flex-wrap gap-2">
                    {['10"', '12"', '14"', '16"', '18"', '20"', '24"', '30"'].map((length) => (
                      <button
                        key={length}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Description */}
                <div className="mt-6 px-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">PRODUCT DESCRIPTION</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 leading-6">
                      {product.description || 'Premium quality wig with exceptional craftsmanship and attention to detail. Perfect for everyday wear or special occasions with comfortable fit and natural appearance.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="max-w-xl -mt-4 md:mt-3 ml-4 md:ml-0 md:col-span-1 lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.soldOut || justAdded}
                  className={`${product.soldOut ? 'flex items-center gap-1 bg-gray-300 text-gray-600 px-4 py-3 rounded-md font-semibold shadow-sm cursor-not-allowed' : justAdded ? 'flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-md font-semibold shadow-sm cursor-not-allowed' : 'flex items-center gap-1 bg-blue-600 text-xs text-white px-4 py-3 rounded-md font-semibold shadow-sm cursor-pointer hover:bg-blue-700 hover:scale-[1.01] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400'}`}
                >
                  {product.soldOut ? (
                    'SOLD OUT'
                  ) : justAdded ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="20" r="1"/><circle cx="20" cy="20" r="1"/></svg>
                      ADD TO CART
                    </>
                  )}
                </button>

                {!product.soldOut && (
                  <button onClick={handleBuyNow} className="px-4 py-3 rounded-md border border-blue-300 text-xs font-semibold cursor-pointer hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400">BUY NOW</button>
                )}
              </div>
            </div>

            <hr className="my-10 border-gray-200" />

            {/* Related products */}
            <h3 className="text-sm tracking-widest font-semibold">YOU MIGHT ALSO LIKE</h3>
            <NewArrival limit={4} className="mt-6" hideTitle product={product} showSeeMore={true} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dynamic
