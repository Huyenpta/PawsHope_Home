export const KnowledgeBase = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto max-w-6xl px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Cẩm nang cho Sen 📖</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all" />
          <div className="absolute inset-0 bg-orange-900/40 flex items-center justify-center"><h3 className="text-white text-2xl font-bold">Kiến thức chăm sóc Cún</h3></div>
        </div>
        <div className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all" />
          <div className="absolute inset-0 bg-green-900/40 flex items-center justify-center"><h3 className="text-white text-2xl font-bold">Kiến thức chăm sóc Miu</h3></div>
        </div>
      </div>
    </div>
  </section>
);