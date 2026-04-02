export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Sushiman</h1>
          <p className="text-xl text-gray-300 mb-8">Discover the finest Japanese sushi experience</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition">
              <h3 className="text-2xl font-semibold mb-4">🍣 Fresh Sushi</h3>
              <p className="text-gray-300">Premium ingredients imported directly from Japan</p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition">
              <h3 className="text-2xl font-semibold mb-4">👨‍🍳 Expert Chefs</h3>
              <p className="text-gray-300">Trained sushi masters with decades of experience</p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition">
              <h3 className="text-2xl font-semibold mb-4">🚚 Fast Delivery</h3>
              <p className="text-gray-300">Enjoy your sushi fresh, delivered to your door</p>
            </div>
          </div>

          <div className="mt-12">
            <a href="/shop" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition">
              Explore Our Menu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
