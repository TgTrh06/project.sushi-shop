import { Link } from "react-router-dom";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const AboutPage = () => {
  const images = {
    counter: "/about_interior.png",
    garden: "/about_garden.png",
    hero: "/about_hero.png",
    chef: "/about_chef.png",
  };

  return (
    <div className="page-container about-page">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "About" }]} />

      <div className="about-page-content">

        {/* SECTION 1: PHILOSOPHY */}
        <section className="about-card about-philosophy-card" data-aos="fade-up">
          <div className="about-philosophy__kanji">魂</div>
          <div className="about-philosophy__text">
            <h2 className="about-philosophy__title">Breathe Life into Every Grain</h2>
            <p>
              "Itsu" is more than a name; it is an ideal of effortless elegance.
              At ItsuSushi, we believe the essence of the Omakase experience lies in the "Ma" — the space between.
              It is the silence between notes, the precision of a single cut, and the warmth of rice at the exact tempo of the heart.
            </p>
            <p>
              Our philosophy is rooted in the purity of the season. We don't just serve fish;
              we celebrate the momentary peak of excellence, captured right at our L-shaped Hinoki counter.
            </p>
          </div>
          <div className="about-philosophy__image">
            <img src={images.chef} alt="Chef Craft" />
          </div>
        </section>

        {/* SECTION 2: THE THREE PILLARS */}
        <section className="about-card" data-aos="fade-up">
          <h2 className="about-section-title">Our Three Pillars</h2>
          <div className="about-pillars">
            <div className="pillar-card" data-aos="fade-up">
              <div className="pillar-card__kanji">旬</div>
              <div className="pillar-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M2 12C2 12 5 7 12 7C19 7 22 12 22 12C22 12 19 17 12 17C5 17 2 12 2 12Z" />
                  <path d="M12 12C12 13.6569 10.6569 15 9 15" />
                  <path d="M12 12C12 10.3431 13.3431 9 15 9" />
                </svg>
              </div>
              <h3 className="pillar-card__title">The Source (旬)</h3>
              <p className="pillar-card__description">
                Directly from the sea to our kitchen. We honor the rhythm of nature,
                sourcing only what is at its peak of flavor and vitality.
              </p>
            </div>

            <div className="pillar-card" data-aos="fade-up" data-aos-delay="150">
              <div className="pillar-card__kanji">匠</div>
              <div className="pillar-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14.5 17.5L3 6L6 3L17.5 14.5L14.5 17.5Z" />
                  <path d="M13 19L21 21L19 13L13 19Z" />
                </svg>
              </div>
              <h3 className="pillar-card__title">The Skill (匠)</h3>
              <p className="pillar-card__description">
                Every slice is a legacy. Our masters spent decades perfecting
                the balance of pressure, temperature, and timing.
              </p>
            </div>

            <div className="pillar-card" data-aos="fade-up" data-aos-delay="300">
              <div className="pillar-card__kanji">誠</div>
              <div className="pillar-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 21C12 21 2 14.5 2 8.5C2 5.46243 4.46243 3 7.5 3C9.5 3 11 4 12 5.5C13 4 14.5 3 16.5 3C19.5 3 22 5.46243 22 8.5C22 14.5 12 21 12 21Z" />
                </svg>
              </div>
              <h3 className="pillar-card__title">Service (誠)</h3>
              <p className="pillar-card__description">
                Omotenashi is hospitality from the heart. We anticipate your needs
                before they are spoken, creating a haven of quiet luxury.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: GALLERY */}
        <section className="about-card" data-aos="fade-up">
          <h2 className="about-section-title">Enter the Zen Space</h2>
          <div className="about-gallery">
            <div className="gallery-item gallery-item--1">
              <img src={images.counter} alt="Omakase Counter" />
            </div>
            <div className="gallery-item gallery-item--2">
              <img src={images.garden} alt="Zen Garden" />
            </div>
            <div className="gallery-item gallery-item--3">
              <img src={images.hero} alt="Sushi Detail" />
            </div>
            <div className="gallery-item gallery-item--4">
              <img src={images.chef} alt="Chef Hands" />
            </div>
          </div>
        </section>

        {/* SECTION 4: CTA */}
        <section className="about-card about-cta-card" data-aos="fade-up">
          <h3 className="about-philosophy__title">The table is prepared.</h3>
          <p className="about-cta-subtitle">Experience the soul of ItsuSushi.</p>
          <Link to="/reservation" className="btn-elegant">
            Book your experience
          </Link>
        </section>

      </div>
    </div>
  );
};
