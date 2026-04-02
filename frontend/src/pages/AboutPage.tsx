export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-12 text-center">About Sushiman</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-3xl font-semibold mb-4 text-yellow-500">Our Story</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Founded in 2015, Sushiman has been serving authentic Japanese cuisine to food enthusiasts 
              around the world. Our mission is to bring the true essence of Japanese culinary tradition 
              to your table, using only the finest and freshest ingredients.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4 text-yellow-500">Our Philosophy</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              We believe that great sushi is not just about ingredients—it's about technique, tradition, 
              and passion. Each roll is crafted with meticulous attention to detail by our master sushi chefs 
              who have trained for years to perfect their craft.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4 text-yellow-500">Our Chefs</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Our team comprises certified sushi masters with extensive experience in Japanese cuisine. 
              They work tirelessly to ensure every dish meets our high standards of quality and authenticity.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4 text-yellow-500">Quality Promise</h2>
            <ul className="space-y-3 text-lg text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-yellow-500">✓</span>
                100% Fresh ingredients delivered daily
              </li>
              <li className="flex items-center gap-3">
                <span className="text-yellow-500">✓</span>
                No artificial preservatives or additives
              </li>
              <li className="flex items-center gap-3">
                <span className="text-yellow-500">✓</span>
                Fast and reliable delivery service
              </li>
              <li className="flex items-center gap-3">
                <span className="text-yellow-500">✓</span>
                Customer satisfaction guaranteed
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
