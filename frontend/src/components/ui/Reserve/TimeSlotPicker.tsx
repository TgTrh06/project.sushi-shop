import React from "react";

export interface TimeSlot {
  id: string;
  label: string;
  session: "lunch" | "dinner";
}

export const LUNCH_SLOTS: TimeSlot[] = [
  { id: "11:30", label: "11:30 - 13:00", session: "lunch" },
  { id: "13:15", label: "13:15 - 14:45", session: "lunch" },
];

export const DINNER_SLOTS: TimeSlot[] = [
  { id: "17:00", label: "17:00 - 19:00", session: "dinner" },
  { id: "19:15", label: "19:15 - 21:15", session: "dinner" },
  { id: "21:30", label: "21:30 - 23:30", session: "dinner" },
];

interface TimeSlotPickerProps {
  selectedSlotId: string | null;
  onSlotSelect: (slotId: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedSlotId,
  onSlotSelect,
}) => {
  return (
    <div className="time-slot-picker">
      <div className="slot-session">
        <h4 className="session-title">Lunch Session</h4>
        <div className="slot-grid">
          {LUNCH_SLOTS.map((slot) => (
            <button
              key={slot.id}
              type="button"
              className={`slot-pill ${selectedSlotId === slot.id ? "is-active" : ""}`}
              onClick={() => onSlotSelect(slot.id)}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      <div className="slot-session" style={{ marginTop: "20px" }}>
        <h4 className="session-title">Dinner Session</h4>
        <div className="slot-grid">
          {DINNER_SLOTS.map((slot) => (
            <button
              key={slot.id}
              type="button"
              className={`slot-pill ${selectedSlotId === slot.id ? "is-active" : ""}`}
              onClick={() => onSlotSelect(slot.id)}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
