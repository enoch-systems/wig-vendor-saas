
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import NewArrival from './NewArrival'
import Footer from './Footer'
import wig1 from '../assets/wig1.jpeg'
import wig2 from '../assets/wig2.jpeg'
import wig3 from '../assets/wig3.jpeg'
import wig4 from '../assets/wig4.jpeg'
import wig5 from '../assets/wig5.jpeg'
import { products } from '../data/products'

const Carousel = () => {
  const slides = [
    { id: 0, title: 'Lace Front Wigs', subtitle: 'Slay all day with our seamless lace fronts' },
    { id: 1, title: 'Human Hair Wigs', subtitle: 'Get that natural glow up with our human hair collection' },
    { id: 2, title: 'Synthetic Wigs', subtitle: 'Switch up your style effortlessly with our versatile synthetics' },
    { id: 3, title: 'Custom Wigs', subtitle: 'Unleash your inner diva with a wig made just for you' },
    { id: 4, title: 'Wig Accessories', subtitle: 'Everything you need to keep your wig looking flawless' },
  ]
  const [index, setIndex] = useState(0)
  const [autoplay] = useState(true)
  const navigate = useNavigate()

  const prev = () => setIndex(i => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex(i => (i + 1) % slides.length)
  const goTo = (i) => setIndex(i)

  useEffect(() => {
    if (!autoplay) return
    const id = setInterval(() => {
      setIndex(i => (i + 1) % slides.length)
    }, 3000)
    return () => clearInterval(id)
  }, [autoplay, slides.length])

  return (
    <div className="w-full overflow-hidden relative mt-5 ">
      <div className="flex transition-transform duration-700 md:duration-600 ease-in-out" style={{ transform: `translate3d(-${index * 100}%, 0, 0)`, willChange: 'transform' }}>
                {slides.map((s, i) => (
          <div key={s.id} className="flex-shrink-0 min-w-full">
            <div
              className={`slide-bg relative w-full px-0 pt-20 md:pt-35 pb-36 md:pb-55 flex flex-col items-center mt-3 text-center bg-transparent transition-transform duration-700 ease-in-out ${i === index ? 'scale-105 shadow-2xl' : ''}`}
              style={{ overflow: 'hidden' }}
            >
              {(() => {
                const img = i === 0 ? wig1 : i === 1 ? wig2 : i === 2 ? wig3 : i === 3 ? wig4 : i === 4 ? wig5 : null
                return img ? (
                  <img
                    src={img}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    width="1600"
                    height="900"
                    aria-hidden="true"
                  />
                ) : null
              })()}

              <div className="absolute top-0 left-0 w-full h-59 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10" />
              <div className="mt-30 w-full max-w-xl relative z-20">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-roboto text-white tracking-wide uppercase drop-shadow-lg">
                  {s.title}
                </h1>
                <p className="mt-3 text-white text-sm sm:text-base font-roboto drop-shadow-lg">{s.subtitle}</p>

                <div className="mt-8 flex justify-center">
                  <button 
                    className="relative flex items-center justify-center px-8 py-3 text-lg font-bold text-white uppercase bg-black rounded-full shadow-lg overflow-hidden group transition-all duration-300 hover:scale-105"
                    type="button" 
                    onClick={() => navigate('/shop')}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400/30 via-teal-500/30 to-cyan-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform scale-110 group-hover:scale-100"></span>
                    <span className="relative z-10 flex items-center gap-2">
                      {(`SHOP ${String(s.title).trim()}`).toUpperCase()}
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-59 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
            </div>
          </div>
        ))}
      </div>

      <button aria-label="Previous slide" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/100 rounded-full p-2 shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button aria-label="Next slide" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/100 rounded-full p-2 shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} className={`w-2 h-2 rounded-full ${i === index ? 'bg-gray-800' : 'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  )
}

const Home = () => {
  const navigate = useNavigate()

  // mount animation state (top -> bottom slide in)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // respect user preference for reduced motion
    try {
      if (window && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setMounted(true)
        return
      }
    } catch (err) { /* ignore */ }
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])


  // Preload hero carousel background images and warm up the browser image cache
  useEffect(() => {
    const imgs = [wig1, wig2, wig3, wig4, wig5];
    const links = [];
    imgs.forEach(src => {
      if (!src) return;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
      links.push(link);
      const i = new Image();
      i.src = src;
      i.decoding = 'sync';
    });
    return () => {
      links.forEach(l => l.parentNode && l.parentNode.removeChild(l));
    };
  }, []);

  return (
    <>
      <main>
        <Carousel />
      </main>
      <NewArrival showSeeMore={true} />
      <Footer />
    </>
  );
};

export default Home;
