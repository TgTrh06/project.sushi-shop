export default function MenuPage() {
  const dishes = [
    {
      id: "1",
      name: "Chezu Sushi",
      price: 21,
      image: "/assets/sushi-12.png",
      rating: 4.9,
    },
    {
      id: "2",
      name: "Original Sushi",
      price: 19,
      image: "/assets/sushi-11.png",
      rating: 5.0,
    },
    {
      id: "3",
      name: "Ramen Legendo",
      price: 13,
      image: "/assets/sushi-10.png",
      rating: 4.7,
    },
  ];

  return (
    <section className="popular-foods">
      <h2 className="popular-foods__title">
        Popular Food / 人気
      </h2>

      {/* FILTER (giữ nguyên style gốc) */}
      <div className="popular-foods__filters sushi__hide-scrollbar">
        <button className="popular-foods__filter-btn active">All</button>

        <button className="popular-foods__filter-btn">
          <img src="/assets/sushi-9.png" alt="sushi" />
          Sushi
        </button>

        <button className="popular-foods__filter-btn">
          <img src="/assets/sushi-8.png" alt="ramen" />
          Ramen
        </button>

        <button className="popular-foods__filter-btn">
          <img src="/assets/sushi-7.png" alt="udon" />
          Udon
        </button>
      </div>

      {/* CARD đúng structure */}
      <div className="popular-foods__catalogue">
        {dishes.map((dish, index) => (
          <article
            key={dish.id}
            className={`popular-foods__card ${
              index === 1 ? "active-card" : ""
            }`}
          >
            <img
              className="popular-foods__card-image"
              src={dish.image}
              alt={dish.name}
            />

            <h4 className="popular-foods__card-title">
              {dish.name}
            </h4>

            <div className="popular-foods__card-details flex-between">
              <div className="popular-foods__card-rating">
                <img src="/assets/star.svg" alt="star" />
                <p>{dish.rating}</p>
              </div>

              <p className="popular-foods__card-price">
                ${dish.price}.00
              </p>
            </div>
          </article>
        ))}
      </div>

      <button className="popular-foods__button">
        Explore Food
        <img src="/assets/arrow-right.svg" alt="arrow" />
      </button>
    </section>
  );
}