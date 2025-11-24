import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Product, Review } from '../types';
import { ShoppingBag, Star, ArrowLeft, Send, Plus, Minus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, user, addProductReview } = useStore();
  const { t } = useLanguage();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  
  // Quantity State
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    const found = products.find(p => p.id === id);
    if (found) {
        setProduct(found);
    }
  }, [id, products]);

  if (!product) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-4">Product not found.</p>
            <Link to="/shop" className="text-primary-600 hover:underline">Return to Shop</Link>
        </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id && p.status === 'active')
    .slice(0, 4);

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
        navigate('/login');
        return;
    }
    if (product.stock > 0) {
        addToCart(product, quantity);
        // Reset quantity after adding
        setQuantity(1);
        // Optional: Show a small toast/feedback here
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
          navigate('/login');
          return;
      }
      if (!comment.trim()) {
          setReviewError('Please write a comment.');
          return;
      }

      const newReview: Review = {
          id: `rev-${Date.now()}`,
          userId: user.id,
          userName: user.name,
          rating: rating,
          comment: comment,
          date: new Date().toISOString()
      };

      addProductReview(product.id, newReview);
      setComment('');
      setRating(5);
      setReviewError('');
      
      setProduct(prev => prev ? {
          ...prev,
          reviews: [...(prev.reviews || []), newReview]
      } : null);
  };

  // Calculate Average Rating
  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 'New';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

      {/* Main Product Layout */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="bg-gray-50 h-[400px] md:h-auto relative">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  {product.isSeasonal && (
                    <span className="absolute top-4 left-4 bg-earth-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Seasonal
                    </span>
                  )}
              </div>

              {/* Details Section */}
              <div className="p-8 md:p-12 flex flex-col">
                  <div className="mb-2 flex items-center justify-between">
                     <span className="text-primary-600 font-bold uppercase tracking-wider text-sm">{product.category}</span>
                     <div className="flex items-center text-yellow-500 font-bold bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={16} fill="currentColor" className="mr-1" /> {avgRating}
                     </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>
                  
                  <div className="mt-auto">
                      <div className="flex items-baseline mb-6">
                        {product.discountPrice ? (
                            <>
                            <span className="text-3xl font-bold text-earth-900 mr-3">₹{product.discountPrice}</span>
                            <span className="text-gray-400 text-xl line-through">₹{product.price}</span>
                            <span className="ml-3 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded">
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                            </span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-earth-900">₹{product.price}</span>
                        )}
                      </div>

                      {/* Quantity & Add to Cart */}
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-300 rounded-full h-14 px-4 space-x-4">
                              <button 
                                onClick={decrementQuantity}
                                className="text-gray-500 hover:text-primary-600 disabled:opacity-50"
                                disabled={quantity <= 1}
                              >
                                <Minus size={20} />
                              </button>
                              <span className="text-lg font-bold text-gray-900 w-6 text-center">{quantity}</span>
                              <button 
                                onClick={incrementQuantity}
                                className="text-gray-500 hover:text-primary-600 disabled:opacity-50"
                                disabled={quantity >= product.stock}
                              >
                                <Plus size={20} />
                              </button>
                          </div>

                          <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex-1 w-full bg-primary-600 text-white h-14 rounded-full hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-bold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          >
                            <ShoppingBag size={20} className="mr-2" />
                            {product.stock === 0 ? t('Out of Stock') : t('Add to Cart')}
                          </button>
                      </div>
                      {product.stock > 0 && product.stock < 10 && (
                          <div className="mt-3 text-center sm:text-left">
                             <span className="text-red-600 font-medium text-sm animate-pulse">
                                  Hurry! Only {product.stock} left in stock.
                              </span>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* Reviews Section */}
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              
              {/* Write Review */}
              <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
                  {user ? (
                      <form onSubmit={handleSubmitReview}>
                          <div className="mb-4">
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating</label>
                              <div className="flex space-x-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`${rating >= star ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
                                      >
                                          <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                                      </button>
                                  ))}
                              </div>
                          </div>
                          <div className="mb-4">
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Review</label>
                              <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 h-24"
                              />
                          </div>
                          {reviewError && <p className="text-red-500 text-sm mb-2">{reviewError}</p>}
                          <button type="submit" className="bg-earth-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-earth-700 text-sm flex items-center">
                              <Send size={16} className="mr-2" /> Post Review
                          </button>
                      </form>
                  ) : (
                      <div className="text-gray-500">
                          Please <Link to="/login" className="text-primary-600 underline">login</Link> to leave a review.
                      </div>
                  )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                  {reviews.length === 0 ? (
                      <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
                  ) : (
                      reviews.map((review) => (
                          <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center space-x-2">
                                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs">
                                          {review.userName.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="font-bold text-gray-900">{review.userName}</span>
                                  </div>
                                  <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex text-yellow-400 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-200"} />
                                  ))}
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
          <div className="border-t border-gray-100 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedProducts.map(p => (
                      <Link to={`/product/${p.id}`} key={p.id} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                          <div className="h-48 bg-gray-100 relative overflow-hidden">
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-4">
                              <h3 className="font-bold text-gray-900 mb-1 truncate">{p.name}</h3>
                              <p className="text-primary-600 font-bold">₹{p.discountPrice || p.price}</p>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};