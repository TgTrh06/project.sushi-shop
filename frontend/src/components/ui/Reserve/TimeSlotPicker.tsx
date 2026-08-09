import React from "react";
import type { ReservationConfig, SessionType } from "@/features/reservation/types/reservation.types";

interface TimeSlotPickerProps {
  selectedSession: SessionType | null;
  selectedSlotId: string | null;
  onSessionSelect: (session: SessionType) => void;
  onSlotSelect: (slotId: string) => void;
  config: ReservationConfig;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedSession,
  selectedSlotId,
  onSessionSelect,
  onSlotSelect,
  config,
}) => {
  return (
    <div className="time-slot-picker">
      {/* Session Selector */}
      <div className="session-selector">
        <h4 className="session-title">Select Session</h4>
        <div className="session-grid">
          {config.sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className={`session-pill ${selectedSession === session.id ? "is-active" : ""}`}
              onClick={() => onSessionSelect(session.id)}
            >
              {session.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slot Selector - Only show when session is selected */}
      {selectedSession && (
        <div className="slot-session" style={{ marginTop: "24px" }}>
          <h4 className="session-title">Select Time Slot</h4>
          <div className="slot-grid">
            {config.sessions
              .find((s) => s.id === selectedSession)
              ?.slots.map((slot) => (
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
      )}
    </div>
  );
};
