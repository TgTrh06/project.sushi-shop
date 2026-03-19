export const ShopPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center">Our Menu</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                <span className="text-4xl">🍣</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sushi Roll #{item}</h3>
                <p className="text-gray-400 text-sm mb-4">Fresh and delicious sushi roll with premium ingredients</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-yellow-500">$12.99</span>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
