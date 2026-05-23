import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  CreditCard, 
  ChevronLeft, 
  Minus, 
  Plus, 
  ShieldCheck, 
  Truck, 
  Heart 
} from "lucide-react";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Simulated product data fetching based on ID
  const product = {
    id: id,
    name: "Rescue Hero Tee",
    price: 25.00,
    category: "Clothing",
    description: "Wear your support with pride. This high-quality organic cotton tee is breathable, durable, and most importantly, saves lives. 100% of the profits from this shirt go directly to our emergency medical fund for rescued animals in Hanoi.",
    details: [
      "100% Organic Cotton",
      "Screen-printed by hand",
      "Unisex modern fit",
      "Reinforced neck and shoulder seams"
    ],
    image: "https://di2ponv0v5otw.cloudfront.net/posts/2025/05/24/68320ca85df8e7b0ce462767/m_wp_68320cb449e17b2f6242c99b.webp"
  };

  const handleAddToCart = () => {
    setIsAdded(true);
    // Logic to update your global Cart Context would go here
    setTimeout(() => setIsAdded(false), 2000);
    console.log(`Added ${quantity} of item ${id} to cart.`);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb Navigation */}
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 text-[#2c5f51] font-black uppercase text-[10px] tracking-widest mb-10 hover:text-[#f6931d] transition-colors"
        >
          <ChevronLeft size={16} /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Image Gallery Section */}
          <div className="space-y-4">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-white shadow-2xl border-8 border-white group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="flex gap-4">
               <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#2c5f51] bg-white">
                 <img src={product.image} alt="thumbnail" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="flex flex-col space-y-8 py-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge className="bg-[#f6931d] text-white border-none uppercase text-[10px] font-black tracking-widest px-4 py-1.5 shadow-md">
                  Fundraiser Item
                </Badge>
                <button className="text-gray-300 hover:text-red-500 transition-colors">
                  <Heart size={24} fill="currentColor" />
                </button>
              </div>
              
              <h1 className="text-5xl font-black text-[#2c5f51] uppercase tracking-tighter leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-black text-[#f6931d] tracking-tighter italic">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest">
                  In Stock & Ready to Ship
                </p>
              </div>

              <p className="text-gray-500 font-medium leading-relaxed max-w-md">
                {product.description}
              </p>
            </div>

            {/* Specifications List */}
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {product.details.map((detail, index) => (
                <li key={index} className="flex items-center gap-2 text-[11px] font-bold text-[#2c5f51] uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f6931d]" /> {detail}
                </li>
              ))}
            </ul>

            <hr className="border-gray-100" />

            {/* Quantity and Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Quantity</span>
                <div className="flex items-center border-2 border-gray-100 rounded-full p-1 bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#fdfaf5] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-black text-[#2c5f51]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#fdfaf5] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={handleAddToCart}
                  className={`flex-1 rounded-full font-black uppercase tracking-widest py-8 shadow-xl transition-all active:scale-95 flex gap-3 ${
                    isAdded ? 'bg-green-600' : 'bg-[#2c5f51] hover:bg-[#1a3a32]'
                  } text-white`}
                >
                  <ShoppingCart size={20} /> 
                  {isAdded ? 'Added to Cart!' : 'Add to Cart'}
                </Button>
                
                <Link to="/checkout" className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-[#f6931d] text-[#f6931d] hover:bg-[#f6931d] hover:text-white rounded-full font-black uppercase tracking-widest py-8 transition-all active:scale-95 flex gap-3"
                  >
                    <CreditCard size={20} /> Buy Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-gray-400">
                <Truck size={20} className="text-[#f6931d]" />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Fast Local <br /> Delivery</p>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <ShieldCheck size={20} className="text-[#f6931d]" />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Secure Payment <br /> Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};