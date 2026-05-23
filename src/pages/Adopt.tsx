import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, MapPin, Info, PawPrint } from "lucide-react";

export const AdoptPage = () => {
  // Danh sách giả lập các bé thú cưng
  const pets = [
    { id: 1, name: "Mochi", breed: "Corgi Mix", age: "2 years", gender: "Female", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b", status: "Available" },
    { id: 2, name: "Coffee", breed: "Local Cat", age: "6 months", gender: "Male", image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783", status: "Urgent" },
    { id: 3, name: "Bơ", breed: "Golden Retriever", age: "1 year", gender: "Male", image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8", status: "Available" },
    { id: 4, name: "Lu", breed: "Pug Mix", age: "3 years", gender: "Female", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee", status: "Processing" },
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf5]">
      {/* Banner Header */}
      <section className="bg-[#2c5f51] py-16 text-center text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Find Your <span className="text-[#f6931d]">Forever Friend</span>
          </h1>
          <p className="text-lg opacity-90 italic">
            "Adopt, don't shop. Every pet deserves a second chance at happiness."
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar: Filters */}
            <aside className="w-full lg:w-1/4 space-y-6">
            {/* Filter Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="font-black text-[#2c5f51] uppercase mb-6 flex items-center gap-2">
                <Filter size={18} /> Filters
                </h3>
                
                <div className="space-y-6">
                {/* Search Field */}
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Search Name</label>
                    <div className="relative mt-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input 
                        className="pl-11 rounded-full border-gray-100 bg-gray-50 focus:bg-white transition-all h-11" 
                        placeholder="Find a friend..." 
                    />
                    </div>
                </div>

                {/* Species Selection */}
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Species</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="outline" size="sm" className="rounded-full border-[#2c5f51] text-[#2c5f51] font-bold px-5">Dogs</Button>
                    <Button variant="outline" size="sm" className="rounded-full border-gray-200 text-gray-500 px-5">Cats</Button>
                    <Button variant="outline" size="sm" className="rounded-full border-gray-200 text-gray-500 px-5">Others</Button>
                    </div>
                </div>

                {/* Age Dropdown */}
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Age Range</label>
                    <select className="w-full mt-2 p-3 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold text-[#2c5f51] focus:outline-none focus:ring-2 focus:ring-[#f6931d]/20 transition-all">
                    <option>All Ages</option>
                    <option>Kitten/Puppy ({"<"} 1 year)</option>
                    <option>Young (1-3 years)</option>
                    <option>Adult (3-7 years)</option>
                    <option>Senior ({">"} 7 years)</option>
                    </select>
                </div>

                {/* Apply Button */}
                <Button className="w-full bg-[#2c5f51] hover:bg-[#1a3a32] text-white rounded-full font-black uppercase py-6 shadow-md shadow-emerald-900/10 transition-all active:scale-95">
                    Apply Filters
                </Button>
                </div>
            </div>

            {/* Promotion/Tip Card */}
            <div className="bg-[#f6931d] p-7 rounded-[2rem] text-white shadow-xl shadow-orange-200 relative overflow-hidden group">
                <div className="relative z-10">
                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                    <Info size={20} />
                </div>
                <h4 className="font-black uppercase tracking-tighter text-lg mb-2">Adoption Tip</h4>
                <p className="text-sm opacity-90 leading-relaxed font-medium">
                    Take your time to visit the shelter and spend a few hours with your potential pet before making the big decision!
                </p>
                </div>
                {/* Trang trí hình chân chó chìm phía sau */}
                <PawPrint size={100} className="absolute -bottom-6 -right-6 text-white/10 rotate-12 group-hover:scale-125 transition-transform duration-700" />
            </div>
            </aside>

          {/* Main Content: Danh sách các bé */}
          <main className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[#2c5f51] font-bold">{pets.length} pets looking for homes</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-400">Sort by: Newest</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="group overflow-hidden rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={pet.image} 
                      alt={pet.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={`${pet.status === 'Urgent' ? 'bg-red-500' : 'bg-[#2c5f51]'} border-none uppercase text-[10px]`}>
                        {pet.status}
                      </Badge>
                    </div>
                    <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-[#f6931d] transition-colors">
                      <Heart size={20} />
                    </button>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-black text-[#2c5f51] uppercase tracking-tighter">{pet.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pet.gender === 'Female' ? 'border-pink-200 text-pink-500' : 'border-blue-200 text-blue-500'}`}>
                        {pet.gender}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-6 text-sm text-gray-500 font-medium">
                      <p className="flex items-center gap-2"><MapPin size={14} className="text-[#f6931d]" /> Shelter: SNNC Hanoi</p>
                      <p className="flex items-center gap-2 italic">Breed: {pet.breed} • Age: {pet.age}</p>
                    </div>

                    <Button className="w-full rounded-full bg-[#f6931d] hover:bg-orange-600 text-white font-bold transition-all shadow-md active:scale-95">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              <Button variant="outline" className="rounded-full w-10 h-10 p-0 border-[#2c5f51] text-[#2c5f51]">1</Button>
              <Button variant="ghost" className="rounded-full w-10 h-10 p-0">2</Button>
              <Button variant="ghost" className="rounded-full w-10 h-10 p-0">3</Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};