import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "@/stores/useThemeStore";

export const AboutPage = () => {
  const { theme } = useThemeStore();
  const [activeSection, setActiveSection] = useState(0);

  const sectionRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ];

  const images = {
    hero: "/about_hero.png",
    counter: "/about_interior.png",
    garden: "/about_garden.png",
    chef: "/about_chef.png",
  };

  // Color Mapping logic
  const sectionColors = [
    { light: "transparent", dark: "transparent", isDark: true }, // Hero (Image)
    { light: "#f9f7f2", dark: "#0d1117", isDark: false },      // Philosophy
    { light: "#f0efea", dark: "#161b22", isDark: false },      // Pillars
    { light: "#ffffff", dark: "#020617", isDark: false },      // Gallery
    { light: "#eceae5", dark: "#1a1b22", isDark: false },      // CTA
  ];

  useEffect(() => {
    const options = {
      root: null,
      threshold: 0.6,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.findIndex((ref) => ref.current === entry.target);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    sectionRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const currentBg = theme === "dark" ? sectionColors[activeSection].dark : sectionColors[activeSection].light;

  const scrollToSection = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="page-container about-page"
      style={{ backgroundColor: currentBg }}
    >
      {/* VERTICAL DOT NAVIGATION */}
      <div className={`dot-nav ${theme === "dark" || activeSection === 0 ? "is-on-dark" : "is-on-light"}`}>
        {sectionColors.map((_, index) => (
          <button
            key={index}
            className={`dot-nav__item ${activeSection === index ? "is-active" : ""}`}
            onClick={() => scrollToSection(index)}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      {/* SECTION 1: ATMOSPHERIC HERO */}
      <section
        ref={sectionRefs[0]}
        className="about-hero"
        style={{ backgroundImage: `url(${images.hero})` }}
      >
        <div className="about-hero__content">
          <h1 className="about-hero__title" data-aos="fade-up">
            Itsu (粋) – The Art of Sophistication
          </h1>
          <p className="about-hero__subtitle" data-aos="fade-up" data-aos-delay="200">
            Where traditional craft meets modern minimalist soul.
          </p>
        </div>
      </section>

      {/* SECTION 2: OUR PHILOSOPHY */}
      <section ref={sectionRefs[1]} className="about-section">
        <div className="container-content about-philosophy">
          <div className="about-philosophy__kanji">魂</div>
          <div className="about-philosophy__text" data-aos="fade-right">
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
          <div className="about-philosophy__image" data-aos="fade-left">
            <img src={images.chef} alt="Chef Craft" />
          </div>
        </div>
      </section>

      {/* SECTION 3: THE THREE PILLARS */}
      <section ref={sectionRefs[2]} className="about-section">
        <div className="container-content">
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

            <div className="pillar-card" data-aos="fade-up" data-aos-delay="200">
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

            <div className="pillar-card" data-aos="fade-up" data-aos-delay="400">
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
        </div>
      </section>

      {/* SECTION 4: THE SPACE GALLERY */}
      <section ref={sectionRefs[3]} className="about-section">
        <div className="container-content">
          <h2 className="about-philosophy__title" style={{ textAlign: 'center', marginBottom: '60px' }} data-aos="fade-up">
            Enter the Zen Space
          </h2>
          <div className="about-gallery" data-aos="zoom-in">
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
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section ref={sectionRefs[4]} className="about-section about-cta" data-aos="fade-up">
        <div className="container-content">
          <h3 className="about-philosophy__title">The table is prepared.</h3>
          <p style={{ marginBottom: '40px', opacity: 0.6 }}>Experience the soul of ItsuSushi.</p>
          <Link to="/reservation" className="btn-elegant">
            Book your experience
          </Link>
        </div>
      </section>
    </div>
  );
};
