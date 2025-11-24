import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Category, Product } from '../types';
import { ShoppingBag, Tag } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const Shop = () => {
  const { products, addToCart, user } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const navigate = useNavigate();

  useEffect(() => {
    const cat = searchParams.get('cat');
    if(cat) setSelectedCategory(cat);
  }, [searchParams]);

  const categories = ['All', ...Object.values(Category)];

  const filteredProducts = products.filter(p => 
    p.status === 'active' && (selectedCategory === 'All' || p.category === selectedCategory)
  );

  const handleAddToCart = (product: Product) => {
    if (!user) {
        navigate('/login');
        return;
    }
    if(product.stock > 0) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-earth-900 mb-4 md:mb-0">Shop Fresh</h1>
        
        {/* Filter */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 space-x-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams(cat === 'All' ? {} : { cat });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No products found in this category.</h3>
          <button onClick={() => setSelectedCategory('All')} className="mt-4 text-primary-600 hover:underline">View all products</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative h-64 bg-gray-100">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                {product.isSeasonal && (
                  <span className="absolute top-3 left-3 bg-earth-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                    <Tag size={12} className="mr-1" /> Seasonal
                  </span>
                )}
                {product.stock === 0 && (
                   <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                     <span className="bg-gray-800 text-white px-4 py-2 rounded-md font-bold">Out of Stock</span>
                   </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="text-xs text-primary-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{product.description}</p>
                
                <div className="mt-auto">
                   <div className="flex items-baseline mb-3">
                     {product.discountPrice ? (
                       <>
                        <span className="text-xl font-bold text-earth-900 mr-2">₹{product.discountPrice}</span>
                        <span className="text-gray-400 text-sm line-through">₹{product.price}</span>
                       </>
                     ) : (
                       <span className="text-xl font-bold text-earth-900">₹{product.price}</span>
                     )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-primary-600 text-white py-2 rounded-full hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};