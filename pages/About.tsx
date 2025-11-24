import React from 'react';
import { CheckCircle, MapPin, Phone, ShieldCheck, Truck, Leaf, Users, Mail } from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-gray-50 pb-16">
      {/* Hero Header */}
      <div className="bg-earth-900 text-earth-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-earth-200">Tradition meets Gen Z innovation.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <div className="prose max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed">
              At <strong>Ponivraa</strong>, we’re a new-age Gen Z farmer collective backed by traditional farmers with over 
              <strong> 25+ years of farming experience</strong>. Rooted in the rich soils of <strong>South Tamil Nadu</strong>, 
              our vision is simple – to deliver nature’s finest directly from our farms to your homes.
            </p>
            <p className="text-lg leading-relaxed">
              We are a <strong>D2C brand (Direct-to-Consumer)</strong>, ensuring that you enjoy farm-fresh products without 
              mediator charges. For over two decades, our families have cultivated multiple crops and nurtured natural produce. 
              Now, we’re bringing our legacy online, so that people across Tier 1 & Tier 2 cities can enjoy pure, farmer-priced goodness.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-earth-900 mb-8 flex items-center">
              <Leaf className="mr-3 text-primary-600" /> Why Choose Ponivraa?
            </h2>
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
              {[
                "Backed by 25+ years of trusted farming",
                "Direct-from-farmer pricing – no middlemen, no hidden costs",
                "Wide product range – from honey to oils to fruits",
                "Farm-fresh & chemical-free produce",
                "Tradition meets Gen Z innovation – blending experience with freshness"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <CheckCircle className="text-primary-600 mt-1 mr-3 flex-shrink-0" size={20} />
                  <span className="font-medium text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact */}
          <div className="bg-white rounded-xl shadow-sm p-8 border-t-4 border-primary-600">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><Phone className="mr-2"/> Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="text-primary-600 mr-3 flex-shrink-0" />
                <span className="font-medium">Alagarkovil, Tamil Nadu</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="text-primary-600 mr-3 flex-shrink-0" />
                <span className="font-medium">+91 80982 02289</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="text-primary-600 mr-3 flex-shrink-0" />
                <span className="font-medium">ponivraa@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-xl shadow-sm p-8 border-t-4 border-earth-500">
             <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><Truck className="mr-2"/> Terms & Conditions</h3>
             <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>All products are naturally sourced; seasonal variations may occur.</li>
                <li>Delivery timelines depend on product availability and logistics.</li>
                <li>Prices include only direct farmer costs – no hidden charges.</li>
                <li>Products should be consumed/stored as per the guidelines provided.</li>
                <li>Ponivraa reserves the right to update product details without prior notice.</li>
             </ul>
          </div>
        </div>
        
        {/* Privacy Policy */}
        <div className="bg-white rounded-xl shadow-sm p-8 border-t-4 border-gray-800">
             <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><ShieldCheck className="mr-2"/> Privacy Policy</h3>
             <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>We collect only essential information to process orders.</li>
                <li>Your personal data is never shared with third parties.</li>
                <li>Secure shopping and customer trust are our priority.</li>
                <li>We may contact you regarding updates or offers with your consent.</li>
                <li>All online transactions are processed securely with encryption.</li>
             </ul>
        </div>
      </div>
    </div>
  );
};