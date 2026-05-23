import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => (
  <section className="relative h-[600px] flex items-center justify-center text-white">
    <img 
      src="https://images.unsplash.com/photo-1450778869180-41d0601e046e" 
      className="absolute inset-0 w-full h-full object-cover brightness-50" 
      alt="Hero background"
    />
    <div className="relative z-10 text-center space-y-6 px-4">
      {/* Professional, high-impact headline */}
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight">
        Join Hands, <br />
        <span className="text-[#f6931d]">Leave No One Behind</span>
      </h1>
      
      {/* Mission statement based on your profile's focus on animal rescue */}
      <p className="text-xl max-w-2xl mx-auto opacity-90 font-medium">
        Over 900 rescued animals are currently under our care. Our mission is to find a loving "forever home" for every little soul.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {/* Adopt Button - Linked to your new AdoptPage */}
        <Link to="/adopt">
          <Button size="lg" className="bg-[#f6931d] hover:bg-orange-600 rounded-full px-10 font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
            Adopt Now
          </Button>
        </Link>

        {/* Support/Donate Button */}
        <Button 
          size="lg" 
          className="bg-[#6f4fba] hover:bg-[#5b3da1] text-white border-none rounded-full px-10 font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
        >
          Support Us
        </Button>

        {/* Volunteer Button */}
        <Button size="lg" variant="secondary" className="rounded-full px-10 font-black uppercase tracking-widest shadow-md transition-all active:scale-95">
          Volunteer
        </Button>
      </div>
    </div>
  </section>
);