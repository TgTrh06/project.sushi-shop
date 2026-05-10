export interface Seat {
  code: string;
  x: number;
  y: number;
  type: "counter" | "table";
}

// Map Configuration - Boutique Omakase Layout
export const SEATS: Seat[] = [
  // --- 2-PERSON TABLES (LEFT COLUMN) ---
  // Table 1
  { code: "T1-A", x: 70, y: 120, type: "table" },
  { code: "T1-B", x: 170, y: 120, type: "table" },
  // Table 2
  { code: "T2-A", x: 70, y: 300, type: "table" },
  { code: "T2-B", x: 170, y: 300, type: "table" },
  // Table 3
  { code: "T3-A", x: 70, y: 480, type: "table" },
  { code: "T3-B", x: 170, y: 480, type: "table" },

  // --- L-SHAPED OMAKASE COUNTER (RIGHT COLUMN) ---
  // Vertical section seats (facing Right towards Kitchen)
  { code: "C1", x: 480, y: 80, type: "counter" },
  { code: "C2", x: 480, y: 140, type: "counter" },
  { code: "C3", x: 480, y: 200, type: "counter" },
  { code: "C4", x: 480, y: 260, type: "counter" },

  // Horizontal section seats (facing Up towards Kitchen)
  { code: "C5", x: 550, y: 390, type: "counter" },
  { code: "C6", x: 610, y: 390, type: "counter" },
  { code: "C7", x: 670, y: 390, type: "counter" },
  { code: "C8", x: 730, y: 390, type: "counter" },
];