import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/home/Hero";
import { AboutSection } from "./components/home/AboutSection";
import { PetAdoptList } from "./components/home/PetAdoptList";
import { Donation } from "./components/home/Donation";
import { KnowledgeBase } from "./components/home/KnowledgeBase";
import { RescueStories } from "./components/home/RescueStories";
import { Partners } from "./components/home/Partners";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <PetAdoptList />
        <Donation />
        <KnowledgeBase />
        <RescueStories />
        <Partners />
      </main>

      <Footer />
    </div>
  );
}

export default App;