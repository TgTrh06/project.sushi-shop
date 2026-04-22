import { useEffect, useState, useRef } from "react";
import { Images } from "@/assets/image";
import { Icon } from "@/assets/svg";

export const HomePage = () => {
  const [activeSection, setActiveSection] = useState(0);

  const sectionRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.findIndex(
            (ref) => ref.current === entry.target
          );
          if (index !== -1) setActiveSection(index);
        }
      });
    }, observerOptions);

    sectionRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page-container">
      {/* VERTICAL DOT NAVIGATION */}
      <div className={`dot-nav ${activeSection === 0 ? "is-on-dark" : "is-on-light"}`}>
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            className={`dot-nav__item ${activeSection === index ? "is-active" : ""}`}
            onClick={() => scrollToSection(index)}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      <section ref={sectionRefs[0]} className="container-content hero">
        <div className="hero-image">
          <img src={Images.sushi.s1} alt="sushi" data-aos="fade-up" />
          <h2 data-aos="fade-up">
            日 <br />
            本 <br />
            食
          </h2>

          <div className="hero-image__overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-content-info" data-aos="fade-left">
            <h1>Feel the taste of Japanese food</h1>
            <p>
              Experience the flavors of Japan's most popular dishes in our cozy atmosphere.
            </p>

            <div className="hero-content__buttons">
              <button className="hero-content__order-button">
                Reserve Now
              </button>
              <button className="hero-content__play-button">
                <img src={Icon.playCircle} alt="play" />
                How to Reserve
              </button>
            </div>
          </div>

          <div className="hero-content__testimonial" data-aos="fade-up">
            <div className="hero-content__customer flex-center">
              <h4>
                24<span>k+</span>
              </h4>
              <p>
                Happy
                <br />
                Customers
              </p>
            </div>

            <div className="hero-content__review">
              <img src={Images.common.userAvatar} alt="user" />
              <p>
                "This is the best Japanese food service that ever existed."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={sectionRefs[1]} className="container-content about-us" id="about-us">
        <div className="about-us__image">
          <div className="about-us__image-sushi3">
            <img src={Images.sushi.s3} alt="sushi" data-aos="fade-right" />
          </div>

          <button className="about-us__button">
            Learn More
            <img src={Icon.arrowUpRight} alt="learn more" />
          </button>

          <div className="about-us__image-sushi2">
            <img src={Images.sushi.s2} alt="sushi" data-aos="fade-right" />
          </div>
        </div>

        <div className="about-us__content" data-aos="fade-left">
          <p className="sushi__subtitle">About Us / 私たちに関しては</p>
          <h3 className="sushi__title">
            Our mission is to bring true Japanese flavours to you.
          </h3>
          <p className="sushi__description">
            We will continue to provide the experience of Omotenashi, the
            Japanese mindset of hospitality, with our shopping and dining for
            our customers.
          </p>
        </div>
      </section>

      <section ref={sectionRefs[2]} className="container-content" id="menu">
        <div className="popular-foods">
          <h2 className="popular-foods__title" data-aos="flip-up">
            Popular Food / 人気
          </h2>

          <div
            className="popular-foods__filters sushi__hide-scrollbar"
            data-aos="fade-up"
          >
            <button className="popular-foods__filter-btn active">All</button>
            <button className="popular-foods__filter-btn">
              <img src={Images.sushi.s9} alt="sushi 9" />
              Sushi
            </button>
            <button className="popular-foods__filter-btn">
              <img src={Images.sushi.s8} alt="sushi 8" />
              Ramen
            </button>
            <button className="popular-foods__filter-btn">
              <img src={Images.sushi.s7} alt="sushi 7" />
              Udon
            </button>
            <button className="popular-foods__filter-btn">
              <img src={Images.sushi.s6} alt="sushi 6" />
              Danggo
            </button>
            <button className="popular-foods__filter-btn">All</button>
          </div>

          <div className="popular-foods__catalogue" data-aos="fade-up">
            <article className="popular-foods__card">
              <img
                className="popular-foods__card-image"
                src={Images.sushi.s12}
                alt="sushi-12"
              />
              <h4 className="popular-foods__card-title">Chezu Sushi</h4>

              <div className="popular-foods__card-details flex-between">
                <div className="popular-foods__card-rating">
                  <img src={Icon.star} alt="star" />
                  <p>4.9</p>
                </div>

                <p className="popular-foods__card-price">$21.00</p>
              </div>
            </article>

            <article className="popular-foods__card active-card">
              <img
                className="popular-foods__card-image"
                src={Images.sushi.s11}
                alt="sushi-11"
              />
              <h4 className="popular-foods__card-title">Original Sushi</h4>

              <div className="popular-foods__card-details flex-between">
                <div className="popular-foods__card-rating">
                  <img src={Icon.star} alt="star" />
                  <p>5.0</p>
                </div>

                <p className="popular-foods__card-price">$19.00</p>
              </div>
            </article>

            <article className="popular-foods__card">
              <img
                className="popular-foods__card-image"
                src={Images.sushi.s10}
                alt="sushi-10"
              />
              <h4 className="popular-foods__card-title">Ramen Legendo</h4>

              <div className="popular-foods__card-details flex-between">
                <div className="popular-foods__card-rating">
                  <img src={Icon.star} alt="star" />
                  <p>4.7</p>
                </div>

                <p className="popular-foods__card-price">$13.00</p>
              </div>
            </article>
          </div>

          <button className="popular-foods__button">
            Explore Food
            <img src={Icon.arrowRight} alt="arrow-right" />
          </button>
        </div>
      </section>

      <section ref={sectionRefs[3]} className="container-content trending" id="food">
        <section className="trending-sushi">
          <div className="trending__content" data-aos="fade-right">
            <p className="sushi__subtitle">What’s Trending / トレンド</p>

            <h3 className="sushi__title">Japanese Sushi</h3>
            <p className="sushi__description">
              Feel the taste of the most delicious Sushi here.
            </p>

            <ul className="trending__list flex-between">
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Make Sushi</p>
              </li>
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Oshizushi</p>
              </li>
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Uramaki Sushi</p>
              </li>
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Nigiri Sushi</p>
              </li>
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Temaki Sushi</p>
              </li>
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Inari Sushi</p>
              </li>
            </ul>
          </div>

          <div className="trending__image flex-center">
            <img src={Images.sushi.s5} alt="sushi-5" data-aos="fade-left" />

            <div className="trending__arrow trending__arrow-left">
              <img src={Icon.arrowVertical} alt="arrow vertical" />
            </div>

            <div className="trending__arrow trending__arrow-bottom">
              <img src={Icon.arrowHorizontal} alt="arrow horizontal" />
            </div>
          </div>
        </section>

        <div className="trending__discover" data-aos="zoom-in">
          <p>Discover</p>
        </div>

        <section className="container-content trending-drinks">
          <div className="trending__image flex-center">
            <img src={Images.sushi.s4} alt="sushi-4" data-aos="fade-right" />

            <div className="trending__arrow trending__arrow-top">
              <img src={Icon.arrowHorizontal} alt="arrow horizontal" />
            </div>

            <div className="trending__arrow trending__arrow-right">
              <img src={Icon.arrowVertical} alt="arrow vertical" />
            </div>
          </div>

          <div className="trending__content" data-aos="fade-left">
            <p className="sushi__subtitle">What’s Trending / トレンド</p>

            <h3 className="sushi__title">Japanese Drinks</h3>
            <p className="sushi__description">
              Feel the taste of the most delicious Japense drinks here.
            </p>

            <ul className="trending__list flex-between">
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Oruncha</p>
              </li>
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Sakura Tea</p>
              </li>
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Aojiru</p>
              </li>
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Ofukucha</p>
              </li>
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Kombu-cha</p>
              </li>
              <li>
                <div className="trending__icon flex-center">
                  <img src={Icon.check} alt="check" />
                </div>
                <p>Mugicha</p>
              </li>
            </ul>
          </div>
        </section>
      </section>
    </div>
  );
};
