import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";

export const PetAdoptList = () => (
  <section className="py-20 bg-[#fdfaf5]">
    <div className="container mx-auto max-w-6xl px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h2 className="text-3xl font-bold text-[#2c5f51]">Các bé đang chờ chủ 🐾</h2>
        <div className="flex gap-2">
          {["Tất cả", "Chó", "Mèo", "Dưới 1 tuổi"].map(filter => (
            <Badge key={filter} variant="outline" className="cursor-pointer hover:bg-[#f6931d] hover:text-white px-4 py-1">{filter}</Badge>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="overflow-hidden group hover:shadow-xl transition-all">
            <img src={`https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?sig=${i}`} className="h-56 w-full object-cover group-hover:scale-105 transition-transform" />
            <CardContent className="p-4 space-y-2">
              <h3 className="text-xl font-bold">Bé Bơ - 2 tuổi</h3>
              <p className="text-sm text-gray-500 italic">Khỏe mạnh, thích quấn người, đã tiêm phòng đủ.</p>
              <Button className="w-full bg-[#2c5f51] hover:bg-green-800">Nhận nuôi ngay</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);