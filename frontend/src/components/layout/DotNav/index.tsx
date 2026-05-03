import "./DotNav.css"

interface DotNavProps {
    activeSection: number;
    totalSections: number;
    scrollToSection: (index: number) => void;
}

export const DotNav = ({ activeSection, totalSections, scrollToSection }: DotNavProps) => {
    return (
        <div className="dot-nav">
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