import React, { useState } from "react";
import Footer from "../pages/Footer";
import MountReveal from '../components/MountReveal' 

const FAQ_ITEMS = [
  {
    q: "Are your wigs human hair or synthetic?",
    a: "We stock both 100% human hair and high-quality synthetic wigs. Each product is clearly labeled. Human hair wigs can be styled with heat tools and dyed, while synthetic wigs come pre-styled and are more affordable.",
  },
  {
    q: "How do I know the right wig size for my head?",
    a: "Most of our wigs come in average adjustable sizes (21-23 inches circumference) with combs and adjustable straps. For custom sizing, measure your head circumference and contact us before ordering.",
  },
  {
    q: "Do you deliver to all states in Nigeria?",
    a: "Yes! We deliver nationwide including Lagos, Abuja, Port Harcourt, Kano, Ibadan and all other states. Delivery is typically 2-5 business days depending on your location.",
  },
  {
    q: "How much is delivery within Nigeria?",
    a: "Delivery fees vary by location: Lagos - ₦1,500, Abuja/Port Harcourt - ₦2,000, Other states - ₦2,500-₦3,000. Free delivery for orders above ₦50,000 within Lagos.",
  },
  {
    q: "Can I pay on delivery in Nigeria?",
    a: "Yes! We offer pay on delivery (POD) for customers in Lagos, Abuja, and Port Harcourt. For other locations, we require 50% upfront payment via bank transfer.",
  },
  {
    q: "How do I maintain and wash my human hair wig?",
    a: "Human hair wigs should be washed every 7-10 wears. Use sulfate-free shampoo, lukewarm water, and air dry. Apply leave-in conditioner and store on a wig stand when not in use.",
  },
  {
    q: "Can your wigs be bleached and colored?",
    a: "Only our 100% human hair wigs can be bleached and colored. Synthetic wigs cannot be processed with chemicals. Always consult a professional stylist for coloring services.",
  },
  {
    q: "Do you offer wig installation services?",
    a: "We partner with professional stylists in Lagos, Abuja, and Port Harcourt who offer installation services at discounted rates for our customers. Contact us for recommendations.",
  },
  {
    q: "What if the wig doesn't fit or match my expectation?",
    a: "We offer 7-day return policy for unused wigs in original packaging. Custom orders and sale items cannot be returned. Return shipping costs are covered by the customer.",
  },
  {
    q: "How long do your human hair wigs last?",
    a: "With proper care, our human hair wigs can last 1-3 years. Synthetic wigs typically last 4-6 months with regular wear. Longevity depends on maintenance frequency and styling habits.",
  },
  {
    q: "Do you have a physical store where I can try wigs?",
    a: "Currently we operate online only, but we have showrooms in Lagos (Lekki) and Abuja (Wuse II) by appointment only. Call us to schedule a visit.",
  },
  {
    q: "Can I order custom-made wigs?",
    a: "Yes! We create custom wigs with your preferred hair type, length, density, and color. Custom orders take 2-3 weeks and require 50% deposit. Contact us with your specifications.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  function toggle(i) {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  }

  return (
    <>
      <MountReveal className="min-h-screen  py-16 md:py-24" style={{
        backgroundColor: 'white',
      }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-gray-500">Help Center</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-4 text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Answers to common questions about ordering, shipping, exchanges and more.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              const contentId = `faq-item-${i}`;
              return (
                <div key={i} className="mb-2 ">
                  <button
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggle(i)}
                    className={`w-full flex items-start justify-between gap-4   shadow-sm border border-gray-200 px-5 py-4 rounded-lg transition-shadow duration-150 ${isOpen ? 'shadow-md ring-1 ring-indigo-50' : 'hover:shadow-sm'}`}
                  >
                    <div className="text-left">
                      <span className="block text-base md:text-lg font-semibold text-gray-800">{item.q}</span>
                      <span className="block mt-1 text-sm text-gray-500">{isOpen ? 'Open' : 'Click to view answer'}</span>
                    </div>

                    <div className={`flex-shrink-0 transform  transition-transform duration-900 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <div id={contentId} className={`overflow-hidden transition-[max-height] duration-900 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="p-5 bg-black/10 border border-t-0 border-gray-100 text-sm text-gray-600 rounded-b-lg">{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </MountReveal>
      <Footer />
    </>
  );
};

export default Faq;
