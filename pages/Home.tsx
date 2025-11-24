import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Home = () => {
  const { products } = useStore();
  
  // Get top 3 active products
  const featuredProducts = products.filter(p => p.status === 'active').slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-earth-100 h-[500px] sm:h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Ponivraa Farm Landscape" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-earth-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Pure. Natural.<br />Straight from the Soil.
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl text-gray-100 font-light leading-relaxed">
            Discover the goodness of Ponivraa. 25+ years of farming heritage brought directly to your doorstep. No chemicals, just nature.
          </p>
          <Link to="/shop" className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Shop Fresh Produce <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">25+ Years Expertise</h3>
            <p className="text-gray-600">Deep-rooted knowledge in traditional and sustainable farming practices.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chemical Free</h3>
            <p className="text-gray-600">100% natural products. No preservatives, no artificial flavors, just purity.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Direct to Consumer</h3>
            <p className="text-gray-600">No middlemen. You get fair prices, and we get fair value for our labor.</p>
          </div>
        </div>
      </section>

      {/* Featured Categories Preview */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-earth-900 mb-12">Our Harvest</h2>
          <div className="grid sm:grid-cols-3 gap-8">
             {/* Honey */}
             <Link to="/shop?cat=Honey" className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer shadow-md">
               <img src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Honey" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/20">
                 <span className="text-white text-2xl font-bold border-2 border-white px-6 py-2 rounded-lg backdrop-blur-sm group-hover:bg-white group-hover:text-earth-900 transition-colors">Honey Collection</span>
               </div>
             </Link>
             {/* Oils */}
             <Link to="/shop?cat=Oils" className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer shadow-md">
               <img src="https://images.unsplash.com/photo-1474979266404-7cadd259d3ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Oils" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/20">
                 <span className="text-white text-2xl font-bold border-2 border-white px-6 py-2 rounded-lg backdrop-blur-sm group-hover:bg-white group-hover:text-earth-900 transition-colors">Pure Oils</span>
               </div>
             </Link>
             {/* Fruits */}
             <Link to="/shop?cat=Fruits" className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer shadow-md">
               <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Fruits" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/20">
                 <span className="text-white text-2xl font-bold border-2 border-white px-6 py-2 rounded-lg backdrop-blur-sm group-hover:bg-white group-hover:text-earth-900 transition-colors">Seasonal Fruits</span>
               </div>
             </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to taste the difference?</h2>
        <p className="text-gray-600 mb-8">Support local farmers and eat healthy. Order your first box today.</p>
        <Link to="/shop" className="inline-block bg-earth-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-earth-600 transition-colors shadow-md">
          Start Shopping
        </Link>
      </section>
    </div>
  );
};