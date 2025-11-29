import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { StorageService } from '../../services/storage';
import { Product, Category } from '../../types';
import { Plus, Edit, Trash, X, Upload, Check, CheckCircle2, XCircle, Sparkles, Wand2, Loader, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { generateProductImage, editProductImage } from '../../services/geminiService';

export const AdminProducts = () => {
  const { products, refreshProducts, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [aiMode, setAiMode] = useState<'generate' | 'edit' | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Honey',
    price: 0,
    stock: 0,
    description: '',
    imageUrl: '',
    isSeasonal: false,
    status: 'active'
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && products.length > 0) {
      const productToEdit = products.find(p => p.id === editId);
      if (productToEdit) {
        handleEdit(productToEdit);
        setSearchParams({});
      }
    }
  }, [products, searchParams, setSearchParams]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setImagePreview(product.imageUrl);
    setIsModalOpen(true);
    setAiMode(null);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        deleteProduct(id); 
        setIsModalOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            if(typeof reader.result === 'string') {
               const result = reader.result as string;
               setFormData(prev => ({ ...prev, imageUrl: result }));
               setImagePreview(result);
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({...formData, imageUrl: e.target.value});
      setImagePreview(e.target.value);
  };

  const handleAiGenerate = async () => {
      if (!aiPrompt) return;
      setAiLoading(true);
      const generatedImage = await generateProductImage(aiPrompt, imageSize);
      if (generatedImage) {
          setFormData(prev => ({ ...prev, imageUrl: generatedImage }));
          setImagePreview(generatedImage);
          setAiMode(null);
      } else {
          alert("Failed to generate image. Check API key and try again.");
      }
      setAiLoading(false);
  };

  const handleAiEdit = async () => {
      if (!aiPrompt || !imagePreview) return;
      setAiLoading(true);
      const editedImage = await editProductImage(imagePreview, aiPrompt);
      if (editedImage) {
          setFormData(prev => ({ ...prev, imageUrl: editedImage }));
          setImagePreview(editedImage);
          setAiMode(null);
      } else {
          alert("Failed to edit image. Ensure you are using a supported image format.");
      }
      setAiLoading(false);
  };

  const openModal = () => {
      setEditingProduct(null);
      setFormData({ 
        name: '', 
        category: 'Honey', 
        price: 0, 
        discountPrice: 0,
        stock: 0, 
        description: '', 
        imageUrl: '', 
        isSeasonal: false, 
        status: 'active' 
      });
      setImagePreview('');
      setIsModalOpen(true);
      setAiMode(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discountPrice: Number(formData.discountPrice || 0),
        id: editingProduct ? editingProduct.id : `prod-${Date.now()}`
    } as Product;

    StorageService.saveProduct(finalData);
    refreshProducts();
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button onClick={openModal} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700 shadow-sm">
          <Plus size={18} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                    <div className="flex items-center">
                        <img src={p.imageUrl || 'https://via.placeholder.com/100?text=No+Img'} alt="" className="w-10 h-10 rounded object-cover mr-3 border border-gray-200" />
                        <span className="font-medium text-gray-900">{p.name}</span>
                        {p.isSeasonal && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200">Seasonal</span>}
                    </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{p.discountPrice || p.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                    <span className={p.stock < 10 ? 'text-red-600 font-bold' : ''}>{p.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {p.status}
                    </span>
                    </td>
                    <td className="px-6 py-4">
                    <div className="flex space-x-2">
                        <button onClick={() => handleEdit(p)} className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Edit"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Delete"><Trash size={18} /></button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-y-auto max-h-[95vh] my-4">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-gray-700">Name</label>
                  <input type="text" required className="w-full border rounded-lg p-2.5 bg-white text-gray-900 border-gray-300 focus:ring-primary-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-gray-700">Category</label>
                  <select className="w-full border rounded-lg p-2.5 bg-white text-gray-900 border-gray-300 focus:ring-primary-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1.5 text-gray-700">Description</label>
                <textarea required className="w-full border rounded-lg p-2.5 bg-white text-gray-900 border-gray-300 focus:ring-primary-500" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-gray-700">Price (₹)</label>
                  <input type="number" required className="w-full border rounded-lg p-2.5 bg-white text-gray-900 border-gray-300 focus:ring-primary-500" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div>
                   <label className="block text-sm font-bold mb-1.5 text-gray-700">Discount Price</label>
                   <input type="number" className="w-full border rounded-lg p-2.5 bg-white text-gray-900 border-gray-300 focus:ring-primary-500" value={formData.discountPrice || ''} onChange={e => setFormData({...formData, discountPrice: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-gray-700">Stock</label>
                  <input type="number" required className="w-full border rounded-lg p-2.5 bg-white text-gray-900 border-gray-300 focus:ring-primary-500" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
              </div>
              
              {/* Image Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-gray-700">Product Image</label>
                      <div className="flex space-x-2">
                          <button 
                            type="button"
                            onClick={() => setAiMode(aiMode === 'generate' ? null : 'generate')}
                            className={`text-xs flex items-center px-2 py-1 rounded border ${aiMode === 'generate' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'}`}
                          >
                              <Sparkles size={12} className="mr-1" /> Generate with AI
                          </button>
                          {imagePreview && (
                              <button 
                                type="button"
                                onClick={() => setAiMode(aiMode === 'edit' ? null : 'edit')}
                                className={`text-xs flex items-center px-2 py-1 rounded border ${aiMode === 'edit' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                              >
                                  <Wand2 size={12} className="mr-1" /> Edit with AI
                              </button>
                          )}
                      </div>
                  </div>

                  {/* AI Controls */}
                  {aiMode && (
                      <div className="mb-4 p-3 bg-white border border-purple-100 rounded-lg shadow-sm">
                          <div className="flex gap-2 mb-2">
                              <input 
                                type="text" 
                                placeholder={aiMode === 'generate' ? "Describe the image to generate..." : "Describe how to edit the image..."}
                                className="flex-1 border rounded p-2 text-sm bg-gray-50 text-gray-900"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                              />
                              {aiMode === 'generate' && (
                                <select 
                                    value={imageSize} 
                                    onChange={(e) => setImageSize(e.target.value as any)}
                                    className="border rounded p-2 text-sm bg-gray-50 text-gray-900"
                                >
                                    <option value="1K">1K</option>
                                    <option value="2K">2K</option>
                                    <option value="4K">4K</option>
                                </select>
                              )}
                          </div>
                          <button 
                            type="button"
                            onClick={aiMode === 'generate' ? handleAiGenerate : handleAiEdit}
                            disabled={aiLoading || !aiPrompt}
                            className="w-full bg-purple-600 text-white py-1.5 rounded text-sm font-medium hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center"
                          >
                              {aiLoading ? <Loader size={14} className="animate-spin mr-2" /> : (aiMode === 'generate' ? <Sparkles size={14} className="mr-2"/> : <Wand2 size={14} className="mr-2"/>)}
                              {aiLoading ? 'Processing...' : (aiMode === 'generate' ? 'Generate Image' : 'Apply Edits')}
                          </button>
                      </div>
                  )}

                  <div className="flex items-start space-x-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-2">
                            <input 
                                type="text" 
                                placeholder="Enter Image URL or Upload ->" 
                                className="flex-1 border rounded-lg p-2 bg-white text-gray-900 border-gray-300 text-sm" 
                                value={formData.imageUrl && formData.imageUrl.startsWith('data:') ? 'Image File Selected' : formData.imageUrl} 
                                onChange={handleUrlChange} 
                                disabled={!!(formData.imageUrl && formData.imageUrl.startsWith('data:'))}
                            />
                        </div>
                        <label className="flex items-center justify-center px-4 py-2.5 bg-white text-primary-700 rounded-lg shadow-sm border border-primary-200 cursor-pointer hover:bg-primary-50 transition-colors w-full">
                            <Upload size={18} className="mr-2" />
                            <span className="text-sm font-semibold">Upload from Computer</span>
                            <input ref={fileInputRef} type='file' className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                      <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative group">
                          {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400 text-center p-1">No Image</span>}
                      </div>
                  </div>
              </div>

              {/* Custom Toggles with Icons */}
              <div className="flex space-x-4 pt-2">
                 <div className="flex items-center justify-between space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200 w-1/2 cursor-pointer" onClick={() => setFormData({...formData, isSeasonal: !formData.isSeasonal})}>
                    <span className="text-sm font-bold text-gray-700">Seasonal Item</span>
                    <div 
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-sm border ${formData.isSeasonal ? 'bg-green-100 text-green-600 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                    >
                        {formData.isSeasonal ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-between space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200 w-1/2 cursor-pointer" onClick={() => setFormData({...formData, status: formData.status === 'active' ? 'inactive' : 'active'})}>
                    <span className="text-sm font-bold text-gray-700">Active Product</span>
                    <div 
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-sm border ${formData.status === 'active' ? 'bg-green-100 text-green-600 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                    >
                        {formData.status === 'active' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    </div>
                 </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md flex justify-center items-center">
                  <Check size={20} className="mr-2" /> {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                
                {/* DELETE BUTTON REQUESTED */}
                {editingProduct && (
                    <button 
                        type="button"
                        onClick={() => handleDelete(editingProduct.id)}
                        className="w-full bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-lg font-bold hover:bg-red-100 flex justify-center items-center text-sm"
                    >
                        <Trash2 size={18} className="mr-2" /> Delete Product
                    </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};