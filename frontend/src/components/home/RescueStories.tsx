import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar } from "lucide-react";

export const RescueStories = () => {
  const stories = [
    {
      id: 1,
      title: "Hành trình hồi sinh của bé Cà Phê bị bỏ rơi giữa đêm đông",
      date: "15/04/2026",
      summary: "Cà Phê được tìm thấy trong tình trạng suy kiệt hoàn toàn. Sau 3 tháng điều trị tích cực...",
      image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=500&auto=format&fit=crop",
      tag: "CỨU HỘ"
    },
    {
      id: 2,
      title: "Vòng tay yêu thương: Bé Mochi đã tìm thấy mái ấm mới tại Đà Lạt",
      date: "10/04/2026",
      summary: "Lời chia sẻ đầy xúc động của gia đình mới nhận nuôi bé Mochi sau gần 1 năm ở trạm.",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=500&auto=format&fit=crop",
      tag: "VỀ NHÀ MỚI"
    },
    {
      id: 3,
      title: "Chiến dịch 'Áo ấm cho cún' - Những món quà sưởi ấm tâm hồn",
      date: "05/04/2026",
      summary: "Hơn 200 chiếc áo len đã được các tình nguyện viên tự tay đan tặng cho các bé tại sân.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=500&auto=format&fit=crop",
      tag: "HOẠT ĐỘNG"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Tiêu đề phần Nhật ký */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#2c5f51] uppercase tracking-tighter">
              Nhật ký cứu hộ & Cộng đồng
            </h2>
            <p className="text-gray-500 italic">Những câu chuyện nhỏ viết nên những hy vọng lớn 🐾</p>
          </div>
          <Button variant="link" className="text-[#f6931d] font-bold p-0 hover:no-underline flex items-center gap-2">
            Xem tất cả bài viết <BookOpen size={18} />
          </Button>
        </div>

        {/* Lưới bài viết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card key={story.id} className="border border-gray-100 shadow-sm group cursor-pointer overflow-hidden rounded-2xl">
              {/* Phần ảnh */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#f6931d] text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                    {story.tag}
                  </span>
                </div>
              </div>
              
              {/* Phần nội dung - Đã thêm padding p-5 để không bị sát viền */}
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center text-gray-400 text-xs gap-2">
                  <Calendar size={14} />
                  <span>{story.date}</span>
                </div>
                
                <h3 className="text-xl font-bold text-[#2c5f51] group-hover:text-[#f6931d] transition-colors line-clamp-2 leading-tight">
                  {story.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {story.summary}
                </p>
                
                <div className="pt-2">
                  <span className="text-[#f6931d] font-bold text-sm border-b-2 border-[#f6931d] pb-0.5">
                    Đọc tiếp
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