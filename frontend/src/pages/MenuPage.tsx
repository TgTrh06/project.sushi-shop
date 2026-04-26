import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/features/products/product.types";
import type { Category } from "@/features/categories/category.types";
import { productService } from "@/features/products/product.service";
import { categoryService } from "@/features/categories/category.service";
import { ProductCard } from "@/components/ui/ProductCard";
import { Icon } from "@/assets/svg";
import { Loader } from "@/components/ui/Loader";

export default function MenuPage() {
  const [activeCategorySlug, setActiveCategorySlug] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await productService.getProducts(1, 100, activeCategorySlug === "all" ? undefined : activeCategorySlug);
        setProducts(result.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategorySlug]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [products, searchQuery]);

  const activeCategoryName = useMemo(() => {
    if (activeCategorySlug === "all") return "All";
    return categories.find(c => c.slug === activeCategorySlug)?.name || activeCategorySlug;
  }, [activeCategorySlug, categories]);

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
                <button
                  className={`menu-category-btn ${activeCategorySlug === "all" ? "is-active" : ""}`}
                  onClick={() => setActiveCategorySlug("all")}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`menu-category-btn ${activeCategorySlug === cat.slug ? "is-active" : ""}`}
                    onClick={() => setActiveCategorySlug(cat.slug)}
                  >
                    {cat.name}
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

          {loading ? (
            <div className="menu-grid">
              <Loader />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="menu-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="menu-empty">
              <p>No matches found in {activeCategoryName}.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
