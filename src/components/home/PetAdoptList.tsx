import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export const PetAdoptList = () => (
  <section className="py-20 bg-[#fdfaf5]">
    <div className="container mx-auto max-w-6xl px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-4xl font-black text-[#2c5f51] uppercase tracking-tighter">
            Waiting for <span className="text-[#f6931d]">Homes</span> 🐾
          </h2>
          <p className="text-gray-500 font-medium">Meet the souls looking for a second chance</p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {["All", "Dogs", "Cats", "Puppies/Kittens"].map(filter => (
            <Badge 
              key={filter} 
              variant="outline" 
              className="cursor-pointer border-[#2c5f51] text-[#2c5f51] hover:bg-[#f6931d] hover:text-white hover:border-[#f6931d] px-5 py-1.5 rounded-full transition-all font-bold uppercase text-[10px] tracking-widest"
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {/* Pet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="overflow-hidden group border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-white">
            <div className="relative overflow-hidden h-64">
              <img 
                src={`https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?sig=${i}`} 
                alt="Rescue pet"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#f6931d] text-white border-none uppercase text-[9px] font-black tracking-tighter">Available</Badge>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#2c5f51] uppercase tracking-tighter leading-none">Mochi — 2 yrs</h3>
                <p className="text-xs text-[#f6931d] font-bold uppercase tracking-widest pl-0.5">Golden Retriever Mix</p>
              </div>
              
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                Healthy, affectionate, and fully vaccinated. Looking for a family who loves afternoon walks.
              </p>

              <Link to="/adopt" className="block pt-2">
                <Button className="w-full bg-[#2c5f51] hover:bg-[#1a3a32] text-white rounded-full font-black uppercase tracking-widest text-xs py-6 shadow-lg shadow-emerald-900/10 transition-all active:scale-95">
                  Adopt Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-16">
        <Link to="/adopt">
          <Button variant="ghost" className="text-[#2c5f51] font-black uppercase tracking-widest hover:bg-transparent hover:text-[#f6931d] transition-colors">
            View All Rescues →
          </Button>
        </Link>
      </div>
    </div>
  </section>
);