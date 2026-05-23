import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Search, MoveRight, Heart, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";

export const ShopPage = () => {
  const categories = ["All Items", "Clothing", "Accessories", "Home Decor", "Pet Supplies"];
  
  const products = [
    {
      id: 1,
      name: "Rescue Hero Tee",
      price: 25.00,
      category: "Clothing",
      image: "https://di2ponv0v5otw.cloudfront.net/posts/2025/05/24/68320ca85df8e7b0ce462767/m_wp_68320cb449e17b2f6242c99b.webp",
      tag: "Best Seller"
    },
    {
      id: 2,
      name: "PawsHope Tote Bag",
      price: 15.00,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
      tag: "Eco-friendly"
    },
    {
      id: 3,
      name: "Ceramic Paw Mug",
      price: 12.50,
      category: "Home Decor",
      image: "https://images.squarespace-cdn.com/content/v1/602d84e4a5c97e17aa72e1c0/1613595892689-Q52FZXGK6GLT1FG9TLX7/SpawtsStore+Mug+Snow.jpg?format=1000w",
      tag: "New Arrival"
    },
    {
      id: 4,
      name: "Rescue Dog Toy",
      price: 10.00,
      category: "Pet Supplies",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800",
      tag: "Charity Choice"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Fundraising Banner Header */}
      <section className="bg-[#2c5f51] py-16 text-center text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-center mb-4">
            <Gift className="text-[#f6931d] animate-bounce" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Shop to <span className="text-[#f6931d]">Support</span>
          </h1>
          <p className="text-lg opacity-90 italic max-w-2xl mx-auto font-medium">
            "100% of proceeds fund our emergency rescues and medical care. Every item purchased writes a new story for a soul in need."
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Modern Sticky Filter Bar */}
        <div className="sticky top-24 z-30 mb-16 flex flex-col md:flex-row justify-between items-center gap-4 p-2 bg-white/80 backdrop-blur-md border rounded-2xl shadow-sm">
          <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button 
                key={cat} 
                className="whitespace-nowrap px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-gray-50 active:scale-95 border border-transparent hover:border-gray-200"
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search fundraiser items..." 
              className="pl-10 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all h-10 text-xs" 
            />
          </div>
        </div>

        {/* Product Grid - "Clean Frame" Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col">
              {/* Square Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-sm">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                />
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-white text-[#2c5f51] border-none rounded-none text-[8px] font-black tracking-[0.2em] px-2 py-1 shadow-sm">
                    {product.tag}
                  </Badge>
                </div>

                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#2c5f51] opacity-0 group-hover:opacity-100 transition-all shadow-lg translate-y-2 group-hover:translate-y-0">
                  <Heart size={18} />
                </button>
              </div>

              {/* Minimalist Info Section */}
              <div className="pt-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase text-[#f6931d] tracking-[0.2em]">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-bold text-[#2c5f51] leading-tight">
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-lg font-black text-[#2c5f51] tracking-tighter italic">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <Link to={`/shop/${product.id}`}>
                  <button className="w-full mt-2 py-4 border-b-2 border-[#2c5f51] text-[#2c5f51] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-between group/btn transition-all hover:bg-[#2c5f51] hover:text-white hover:px-4">
                    Support Now
                    <MoveRight size={16} className="transition-transform group-hover/btn:translate-x-2" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};