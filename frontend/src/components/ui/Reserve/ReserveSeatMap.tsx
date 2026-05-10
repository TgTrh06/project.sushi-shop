import { SEATS } from "@shared/config/seat-map.config";

interface ReserveSeatMapProps {
  selectedSeats: Set<string>;
  occupiedSeats: Set<string>;
  onSeatClick: (seatCode: string) => void;
}

export function ReserveSeatMap({ selectedSeats, occupiedSeats, onSeatClick }: ReserveSeatMapProps) {
  return (
    <div className="reserve-svg-wrapper">
      <svg
        viewBox="0 0 810 600"
        preserveAspectRatio="xMidYMid meet"
        className="reserve-svg-map"
      >
        {/* FLOOR BACKGROUND (Controlled via CSS for light/dark) */}
        <rect x="0" y="0" width="810" height="600" className="svg-bg" rx="16" />

        {/* --- PHYSICAL STRUCTURES --- */}

        {/* The 3 Tables (Left Column) */}
        {[80, 260, 440].map((y, i) => (
          <g key={`table-base-${i}`}>
            <rect x="100" y={y} width="40" height="80" rx="6" className="svg-wood opacity-90" />
            <text x="120" y={y + 45} fontSize="14" textAnchor="middle" className="svg-text-accent">
              T{i + 1}
            </text>
          </g>
        ))}

        {/* 
          Kitchen/Prep Zone (Top Right corner) 
          Defined by an L shape wrapper but visually represented as a darker blocked area
        */}
        <g id="kitchen-zone">
          {/* Back wall of kitchen */}
          <rect x="560" y="40" width="230" height="275" className="svg-kitchen-bg" rx="8" />
          <text x="675" y="180" fontSize="24" textAnchor="middle" fontWeight="bold" className="svg-text-muted" opacity="0.3">
            Kitchen & Prep
          </text>
        </g>

        {/* L-Shaped Counter (wrapping the kitchen) */}
        <path
          d="M 545 60 L 545 330 L 770 330"
          fill="none"
          strokeWidth="40"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="svg-wood-stroke"
        />

        {/* Decorative elements for the counter edge */}
        <path
          d="M 533 60 L 533 340 L 770 340"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="rgba(0,0,0,0.2)"
        />

        {/* Entrance / Foyer / Waiting Area (Bottom Right) */}
        <g id="entrance-zone">
          <path d="M 650 480 L 780 480" strokeWidth="2" strokeDasharray="6,6" className="svg-text-muted" />
          <path d="M 650 480 L 650 580" strokeWidth="2" strokeDasharray="6,6" className="svg-text-muted" />

          <rect x="670" y="520" width="100" height="40" rx="4" className="svg-stone opacity-50" />
          <text x="720" y="545" fontSize="16" textAnchor="middle" fontWeight="500" className="svg-text-accent">
            ENTRANCE
          </text>
        </g>

        {/* Aisle markers */}
        <text x="340" y="300" fontSize="18" textAnchor="middle" letterSpacing="8" transform="rotate(-90 340 300)" opacity="0.15" className="svg-text-accent">
          INDOOR
        </text>

        {/* --- SEATS --- */}
        {SEATS.map((seat) => {
          const isOccupied = occupiedSeats.has(seat.code);
          const isSelected = selectedSeats.has(seat.code);

          const cursor = isOccupied ? "not-allowed" : "pointer";

          // Dynamic classification for css theming
          const seatClass = ["reserve-seat"];
          if (isOccupied) seatClass.push("occupied");
          if (isSelected) seatClass.push("selected");
          if (!isOccupied && !isSelected) seatClass.push("available");

          return (
            <g
              key={seat.code}
              onClick={() => {
                if (!isOccupied) onSeatClick(seat.code);
              }}
              style={{ cursor }}
              className={seatClass.join(" ")}
            >
              <circle
                cx={seat.x}
                cy={seat.y}
                r="18"
                className="reserve-seat__shape"
              />
              <text
                x={seat.x}
                y={seat.y + 5}
                fontSize="11"
                textAnchor="middle"
                className="reserve-seat__text"
                fontWeight="600"
              >
                {seat.code}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
