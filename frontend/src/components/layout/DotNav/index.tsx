interface DotNavProps {
    activeSection: number;
    totalSections: number;
    scrollToSection: (index: number) => void;
}

export const DotNav = ({ activeSection, totalSections, scrollToSection }: DotNavProps) => {
    const navThemeClass = activeSection === 0 ? "is-on-dark" : "is-on-light";

    return (
        <div className={`dot-nav ${navThemeClass}`}>
            {Array.from({ length: totalSections }).map((_: any, index: number) => (
                <button
                    key={index}
                    className={`dot-nav__item ${activeSection === index ? "is-active" : ""}`}
                    onClick={() => scrollToSection(index)}
                    aria-label={`Go to section ${index + 1}`}
                />
            ))}
        </div>
    )
}