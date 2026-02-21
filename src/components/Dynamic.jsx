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

// Product metadata (colors and descriptions)
const PRODUCT_META = {
  1: { colors: ['Natural Black', 'Brown', 'Blonde'], description: 'Luxury human hair wig with premium quality strands. Features a natural hairline, soft texture, and versatile styling options. Perfect for everyday wear or special occasions.' },
  2: { colors: ['Black', 'Brown', 'Auburn'], description: 'Lace front synthetic wig with realistic appearance. Breathable cap construction and pre-styled for convenience. Easy to maintain and style.' },
  3: { colors: ['Dark Brown', 'Light Brown', 'Golden'], description: 'Premium quality wig with superior craftsmanship. Features adjustable straps and a comfortable fit for all-day wear. Natural movement and shine.' },
  4: { colors: ['Jet Black', 'Plum', 'Burgundy'], description: 'Natural look wig with seamless blend. Lightweight construction with realistic texture and appearance. Sold out due to high demand.' },
  5: { colors: ['Custom Colors Available'], description: 'Custom color wig personalized to your preferences. Handcrafted with attention to detail and premium materials. Unique style tailored just for you.' },
  6: { colors: ['Natural Black', 'Dark Brown', 'Light Brown'], description: 'Brazilian virgin hair wig with exceptional quality. Thick, full-bodied hair with natural luster and minimal shedding. Perfect for long-term wear.' },
  7: { colors: ['Black', 'Dark Brown', 'Medium Brown'], description: 'Peruvian straight wig with silky smooth texture. Natural shine and easy to manage. Versatile styling options for any occasion.' },
  8: { colors: ['Natural Black', 'Brown', 'Burgundy'], description: 'Malaysian body wave wig with beautiful waves. Soft to the touch with natural movement. Durable and long-lasting construction.' },
  9: { colors: ['Jet Black', 'Dark Brown', 'Light Brown'], description: 'Indian Remy hair wig with cuticle alignment. Prevents tangling and maintains natural look. Premium quality at an affordable price.' },
  10: { colors: ['Platinum Blonde', 'Golden Blonde', 'Light Brown'], description: 'European human hair wig with finest quality. Exceptionally soft and lightweight. Natural appearance with easy styling.' },
  11: { colors: ['Black', 'Dark Brown', 'Natural Black'], description: 'African American wig designed for natural texture. Perfect blend and density. Comfortable fit for all-day wear.' },
  12: { colors: ['Natural Black', 'Brown', 'Blonde Mix'], description: 'Curly lace front wig with defined curls. Realistic hairline and part. High-quality synthetic fibers for lasting style.' },
  13: { colors: ['Light Brown', 'Dark Brown', 'Golden'], description: 'Wavy human hair wig with beach waves. Natural texture and movement. Easy to maintain and style versatility.' },
  14: { colors: ['Jet Black', 'Brown', 'Platinum Blonde'], description: 'Straight bob wig with classic cut. Professional and stylish appearance. Perfect for business or casual settings.' },
  15: { colors: ['Natural Black', 'Brown', 'Ombre'], description: 'Long layered wig with beautiful layers. Adds volume and movement. Versatile styling for any face shape.' },
  16: { colors: ['Platinum Blonde', 'Black', 'Pink'], description: 'Short pixie cut wig with modern style. Bold and confident look. Easy to maintain with minimal styling required.' },
  17: { colors: ['Natural Brown', 'Caramel', 'Black'], description: 'Medium length wig with versatile styling. Perfect balance between short and long. Natural appearance and comfortable fit.' },
  18: { colors: ['Dark Brown to Blonde', 'Black to Silver', 'Brown to Red'], description: 'Ombre color wig with beautiful gradient. Trendy and fashionable appearance. Premium quality color treatment.' },
  19: { colors: ['Natural Black with Highlights', 'Brown with Blonde', 'Blonde with Lowlights'], description: 'Highlight wig with dimensional color. Adds depth and dimension. Natural-looking highlights for brightness.' },
  20: { colors: ['Brown to Blonde', 'Dark to Light', 'Natural Sunset'], description: 'Balayage wig with hand-painted color. Soft, natural-looking transitions. High-end salon quality at home.' },
  21: { colors: ['Platinum Blonde', 'Honey Blonde', 'Strawberry Blonde'], description: 'Blonde human hair wig with various shades. Premium quality blonde hair. Versatile and sophisticated appearance.' },
  22: { colors: ['Chocolate Brown', 'Espresso', 'Chestnut'], description: 'Brunette wig with rich brown tones. Warm and natural appearance. Complements various skin tones beautifully.' },
  23: { colors: ['Fire Red', 'Burgundy', 'Copper'], description: 'Red hair wig with vibrant colors. Bold and eye-catching appearance. High-quality color that lasts.' },
  24: { colors: ['Jet Black', 'Soft Black', 'Off Black'], description: 'Black color wig with various black shades. Classic and timeless beauty. Natural-looking black tones.' },
  25: { colors: ['Silver Grey', 'Salt and Pepper', 'Charcoal'], description: 'Grey hair wig with sophisticated shades. Elegant and mature appearance. Modern take on grey hair styling.' },
  26: { colors: ['Purple', 'Blue', 'Pink', 'Green'], description: 'Fashion color wig with bold choices. Express your unique style. Vibrant colors that make a statement.' },
  27: { colors: ['Natural Black', 'Brown', 'Blonde'], description: 'Natural wave wig with subtle waves. Effortlessly beautiful appearance. Low maintenance with natural style.' },
  28: { colors: ['Dark Brown', 'Black', 'Caramel'], description: 'Deep wave wig with defined waves. Romantic and elegant look. Perfect for special occasions.' },
  29: { colors: ['Light Brown', 'Blonde', 'Golden'], description: 'Loose wave wig with soft waves. Casual and relaxed appearance. Beach-ready style anytime.' },
  30: { colors: ['Natural Black', 'Brown', 'Blonde Mix'], description: 'Tight curl wig with bouncy curls. Full-bodied and voluminous. Fun and playful personality.' },
  31: { colors: ['Black', 'Brown', 'Mixed Tones'], description: 'Kinky curly wig with tight coils. Natural texture and appearance. Embraces natural hair beauty.' },
  32: { colors: ['Natural Black', 'Brown Tones'], description: 'Afro curl wig with full volume. Bold and confident style. Celebrates natural hair texture.' },
  33: { colors: ['Black', 'Brown', 'Dark Brown'], description: 'Coily wig with springy coils. Defined and manageable curls. Moisture-rich for healthy appearance.' },
  34: { colors: ['Natural Black', 'Brown', 'Blonde'], description: 'Silk base wig with premium construction. Most natural-looking hairline. Undetectable and comfortable.' },
  35: { colors: ['Natural Black', 'Brown', 'Blonde'], description: 'Mono part wig with realistic parting. Versatile styling options. Professional appearance guaranteed.' },
  36: { colors: ['All Colors Available'], description: 'Glueless wig for easy application. No adhesive needed. Comfortable and secure fit for all-day wear.' }
}



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
    
    // Check if it's an accessory ID (starts with 'acc')
    if (typeof id === 'string' && id.startsWith('acc')) {
      const found = accessoryProducts.find(p => p.id === id)
      console.log('Accessory lookup result:', found?.title || 'Not found')
      return found || products[1]
    }
    
    // Check if it's a numeric accessory ID
    const productId = id ? parseInt(id, 10) : null
    if (productId && productId > 1000) {
      const accessoryId = `acc${productId - 1000}`
      const found = accessoryProducts.find(p => p.id === accessoryId)
      console.log('Numeric accessory lookup - productId:', productId, 'accessoryId:', accessoryId, 'result:', found?.title || 'Not found')
      return found || products[1]
    }
    
    // Default to shop products
    if (productId) {
      const found = products.find(p => p.id === productId)
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
  // prepare thumbnails dynamically based on available images
  const _baseImages = product?.images || product?.gallery || [product?.image]
  const thumbImages = _baseImages.length > 0 ? _baseImages : [product?.image]

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
  }, [product])

  useEffect(() => {
    // clear timers when product changes/unmounts
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
      if (addedTimer.current) clearTimeout(addedTimer.current)
    }
  }, [product])

  // keep mainSrc in sync when product changes and preload thumbnails
  useEffect(() => {
    if (product?.image) {
      setMainSrc(product.image)
      setFlipMain(false)
      setSelectedThumb(0)
    }
    // preload thumbnails so navigating from listing feels instant
    const imgs = thumbImages && thumbImages.length ? thumbImages : [product?.image]
    imgs.forEach(src => {
      try {
        const img = new Image()
        img.src = src
      } catch (err) { void err }
    })
  }, [product, thumbImages])

  const goToIndex = (idx) => {
    const i = (idx + thumbImages.length) % thumbImages.length
    const src = thumbImages[i]
    setMainSrc(src)
    setSelectedThumb(i)
    setFlipMain(false)
    if (mainImgRef.current) mainImgRef.current.src = src
  }

  const prevImage = () => {
    let cur = selectedThumb
    if (mainSrc !== thumbImages[selectedThumb]) {
      const found = thumbImages.findIndex(s => s === mainSrc)
      if (found !== -1) cur = found
    }
    goToIndex(cur - 1)
  }

  const nextImage = () => {
    let cur = selectedThumb
    if (mainSrc !== thumbImages[selectedThumb]) {
      const found = thumbImages.findIndex(s => s === mainSrc)
      if (found !== -1) cur = found
    }
    goToIndex(cur + 1)
  }


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
      <div className="min-h-screen bg-white md:pt-25 font-inter text-[#111] px-3">
        {/* Toast */}
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${toastVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`} role="status" aria-live="polite">
          <div className="bg-black text-gray-400 px-7 py-2 text-sm rounded-md shadow">{toastMsg}</div>
        </div>
        <div className="lg:max-w-8xl mx-auto lg:px-28 py-10 px-0">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-3 px-4 py-2 rounded-md border border-gray-400 bg-black/1 text-sm font-semibold shadow-sm">← Back</Link>

          {/* Top area */}
          <div className="mt-7 lg:ml-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Image */}
            <div className="md:col-span-1 lg:col-span-1">
              <div className="relative bg-[hsl(44,45%,98%)] p-0 rounded-xl overflow-hidden">
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
                <div className="p-3 flex items-center gap-3 bg-white rounded-md">
                  {thumbImages.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMainSrc(src)
                        setFlipMain(false)
                        setSelectedThumb(idx)
                        if (mainImgRef.current) mainImgRef.current.src = src
                      }}
                      className={`${THUMB_CLASS} rounded-md overflow-hidden flex-shrink-0 border ${selectedThumb === idx ? 'ring-2 ring-amber-400 border-transparent' : 'border-gray-100'}`}
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

                {/* Product Title, Rating and Price */}
                <div className="mt-6 px-3">
                  <h2 className="text-base md:text-2xl font-bold tracking-widest uppercase">{product.title}</h2>
                  
                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.417 8.27L12 19.77l-7.417 4.097L6 15.597 0 9.75l8.332-1.732z"/></svg>
                      ))}
                    </div>
                    <span className="text-gray-400">({product.rating} reviews)</span>
                  </div>
                  
                  <div className="md:text-2xl text-xl font-[verdana] font-extrabold text-[#111] mt-3">N{product.price.toLocaleString()}</div>
                </div>

                {/* Quantity Selector */}
                <div className="mt-6 px-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">QUANTITY</h3>
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
                  <h3 className="text-sm font-medium text-gray-900 mb-3">LENGTH</h3>
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
              </div>
            </div>

            {/* Right: Details */}
            <div className="max-w-xl -mt-4 md:mt-3 ml-4 md:ml-0 md:col-span-1 lg:col-span-1">
              <p className="text-gray-500 text-sm leading-7 mt-3 md:mt-6 font-[verdana] md:text-base font-thin">
                {product.description || (product.id && typeof product.id === 'number' && PRODUCT_META[product.id]?.description) || 'Product description not available.'}
              </p>

              <div className="mt-8 flex items-center gap-4">
                {(() => {
                  const isAdded = justAdded
                  return (
                    <button
                      onClick={!product.soldOut && !isAdded ? handleAddToCart : undefined}
                      disabled={product.soldOut || isAdded}
                      className={`${product.soldOut ? 'flex items-center gap-1 bg-gray-300 text-gray-600 px-4 py-3 rounded-md font-semibold shadow-sm cursor-not-allowed' : isAdded ? 'flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-md font-semibold shadow-sm cursor-not-allowed' : 'flex items-center gap-1 bg-black text-xs text-white px-4 py-3 rounded-md font-semibold shadow-sm cursor-pointer hover:opacity-95 hover:scale-[1.01] transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400'}`}>
                      {product.soldOut ? (
                        'SOLD OUT'
                      ) : isAdded ? (
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
                  )
                })()}

                {!product.soldOut && (
                  <button onClick={handleBuyNow} className="px-4 py-3 rounded-md border border-black/20 text-xs font-semibold cursor-pointer hover:bg-black hover:text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-200">BUY NOW</button>
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
