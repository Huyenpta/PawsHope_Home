import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export const RescueStories = () => {
  const stories = [
    {
      id: 1,
      title: "The Miraculous Recovery of Coffee: Rescued on a Winter Night",
      date: "April 15, 2026",
      summary: "Found exhausted and starving, Coffee has fought through 3 months of intensive medical care to find hope again...",
      image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=500&auto=format&fit=crop",
      tag: "RESCUE"
    },
    {
      id: 2,
      title: "Happy Tails: Mochi Finds a Forever Home in Da Lat",
      date: "April 10, 2026",
      summary: "A touching letter from the family who adopted Mochi after he spent nearly a year at our shelter.",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=500&auto=format&fit=crop",
      tag: "ADOPTED"
    },
    {
      id: 3,
      title: "Warm Coats Campaign: Bringing Hope to Every Soul",
      date: "April 05, 2026",
      summary: "Over 200 handmade sweaters were donated by our amazing volunteers to keep the animals warm this season.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=500&auto=format&fit=crop",
      tag: "COMMUNITY"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-[#2c5f51] uppercase tracking-tighter leading-none">
              Rescue <span className="text-[#f6931d]">Diaries</span> & Community
            </h2>
            <p className="text-gray-500 italic">Small stories writing big hopes 🐾</p>
          </div>
          <Link to="/blog">
            <Button variant="link" className="text-[#f6931d] font-black uppercase tracking-widest p-0 hover:no-underline flex items-center gap-2 text-xs">
              View All Posts <BookOpen size={16} />
            </Button>
          </Link>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card key={story.id} className="border border-gray-100 shadow-sm group cursor-pointer overflow-hidden rounded-[2rem] bg-white transition-all hover:shadow-xl">
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#f6931d] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                    {story.tag}
                  </span>
                </div>
              </div>
              
              {/* Content Section */}
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-widest gap-2">
                  <Calendar size={12} className="text-[#f6931d]" />
                  <span>{story.date}</span>
                </div>
                
                <h3 className="text-xl font-black text-[#2c5f51] group-hover:text-[#f6931d] transition-colors line-clamp-2 leading-tight uppercase tracking-tighter">
                  {story.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed font-medium opacity-80">
                  {story.summary}
                </p>
                
                <div className="pt-2">
                  <span className="text-[#f6931d] font-black text-[10px] uppercase tracking-[0.2em] border-b-2 border-[#f6931d] pb-1 transition-all group-hover:tracking-[0.3em]">
                    Read More
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};