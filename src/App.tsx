import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { AdoptPage } from "./pages/Adopt"; // Import trang Nhận nuôi của bạn
import { Rescue } from "./pages/Rescue";
import { ShopPage } from "./pages/ShopPage";
import { ContactPage } from "./pages/ContactPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Đường dẫn trang chủ */}
            <Route path="/" element={<Home />} />
            
            {/* Đường dẫn trang nhận nuôi */}
            <Route path="/adopt" element={<AdoptPage />} />
            <Route path="/rescue" element={<Rescue />} />
            <Route path="/Shop" element={<ShopPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shop/${product.id}" element={< ProductDetailPage/>}/>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;