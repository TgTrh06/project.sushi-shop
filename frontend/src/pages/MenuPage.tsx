import { useState, useMemo } from "react";
import { ProductCard, type Product } from "@/components/ui/ProductCard";
import { Images } from "@/assets/image";
import { Icon } from "@/assets/svg";

const CATEGORIES = ["All", "Sushi", "Ramen", "Udon", "Drinks"];

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Chezu Sushi", price: 21, image: Images.sushi.s12, rating: 4.9, category: "Sushi" },
  { id: "2", name: "Original Sushi", price: 19, image: Images.sushi.s11, rating: 5.0, category: "Sushi" },
  { id: "3", name: "Ramen Legendo", price: 13, image: Images.sushi.s10, rating: 4.7, category: "Ramen" },
  { id: "4", name: "Salmon Sashimi", price: 25, image: Images.sushi.s9, rating: 4.8, category: "Sushi" },
  { id: "5", name: "Udon Classic", price: 15, image: Images.sushi.s8, rating: 4.6, category: "Udon" },
  { id: "6", name: "Green Tea", price: 5, image: Images.categories.drinks, rating: 4.9, category: "Drinks" },
  { id: "7", name: "Dragon Roll", price: 22, image: Images.sushi.s7, rating: 4.8, category: "Sushi" },
  { id: "8", name: "Miso Ramen", price: 14, image: Images.sushi.s6, rating: 4.5, category: "Ramen" },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="page-container menu-page">
      {/* Header Section */}
      <section className="menu-hero">
        <div className="container-content">
          <h1 className="menu-hero-title">Our Menu</h1>
          <p className="menu-hero-subtitle">A symphony of authentic Japanese flavors</p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="menu-grid-section">
        <div className="container-content">
          {/* Toolbar Section */}
          <div className="menu-toolbar">
            <div className="menu-toolbar__inner">
              <div className="menu-categories">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`menu-category-btn ${activeCategory === cat ? "is-active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="menu-search-container">
                <div className="menu-search">
                  <img src={Icon.search} alt="search" className="menu-search__icon" />
                  <input
                    type="text"
                    placeholder="Search your favorites..."
                    className="menu-search__input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="menu-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="menu-empty">
              <p>No matches found for "{searchQuery}" in {activeCategory}.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
