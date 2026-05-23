
import { Link } from 'react-router-dom';

export const KnowledgeBase = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto max-w-6xl px-4">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-4xl font-black text-[#2c5f51] uppercase tracking-tighter">
          Pet Care <span className="text-[#f6931d]">Resources</span> 📖
        </h2>
        <p className="text-gray-500 italic">Essential guides for every responsible pet owner</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Dog Care Section */}
        <Link to="/resources/dog-care" className="relative h-72 rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1" 
            alt="Dog care guide"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-[#f6931d]/40 group-hover:bg-[#f6931d]/60 transition-colors flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-white text-3xl font-black uppercase tracking-tight">Dog Care Essentials</h3>
              <p className="text-white/90 text-sm font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Training • Nutrition • Health</p>
            </div>
          </div>
        </Link>

        {/* Cat Care Section */}
        <Link to="/resources/cat-care" className="relative h-72 rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba" 
            alt="Cat care guide"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-[#2c5f51]/40 group-hover:bg-[#2c5f51]/60 transition-colors flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-white text-3xl font-black uppercase tracking-tight">Cat Care Guide</h3>
              <p className="text-white/90 text-sm font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Behavior • Grooming • Wellness</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  </section>
);