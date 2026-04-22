import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ReserveSeatMap } from "@/components/ui/Reserve/ReserveSeatMap";
import { TimeSlotPicker } from "@/components/ui/Reserve/TimeSlotPicker";
import { SeatMapSkeleton } from "@/components/ui/Reserve/SeatMapSkeleton";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/axios";

interface LocationState {
  from?: string;
  bookingState?: {
    selectedSeats: string[];
    date: string;
    slotId: string;
    name: string;
    phone: string;
  };
}

export default function ReservePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  const { user } = useAuthStore();
  const DEPOSIT_PER_SEAT = 100000;

  // States
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(
    new Set(locationState?.bookingState?.selectedSeats || [])
  );
  const [occupiedSeats, setOccupiedSeats] = useState<Set<string>>(new Set());
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);

  const [form, setForm] = useState({
    name: locationState?.bookingState?.name || "",
    phone: locationState?.bookingState?.phone || "",
    date: locationState?.bookingState?.date || new Date().toISOString().split("T")[0],
    slotId: locationState?.bookingState?.slotId || null as string | null,
  });

  // Fetch occupied seats whenever date or slotId changes
  const fetchAvailability = useCallback(async (date: string, slotId: string) => {
    setIsLoadingSeats(true);
    try {
      const response = await api.get(`/resevations/occupied-seats`, {
        params: { date, slot: slotId },
      });
      if (response.data.success) {
        setOccupiedSeats(new Set(response.data.data));
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      toast.error("Could not load seat availability. Please try again.");
    } finally {
      setIsLoadingSeats(false);
    }
  }, []);

  useEffect(() => {
    if (form.date && form.slotId) {
      fetchAvailability(form.date, form.slotId);
      // Clear selected seats when changing date/slot unless it's the initial restoration
      if (!locationState?.bookingState) {
        setSelectedSeats(new Set());
      }
    }
  }, [form.date, form.slotId, fetchAvailability]);

  const handleSeatClick = (seatId: string) => {
    if (!form.slotId || !form.date) {
      toast.error("Please select a date and time slot first.");
      return;
    }

    setSelectedSeats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(seatId)) {
        newSet.delete(seatId);
      } else {
        newSet.add(seatId);
      }
      return newSet;
    });
  };

  const handleProceedPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.date || !form.slotId) {
      toast.error("Please select a date and time slot.");
      return;
    }

    if (selectedSeats.size === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    // AUTH GUARD
    if (!user) {
      toast.error("Please login to proceed with your booking.");
      // Redirect to login with current booking state
      navigate("/login", {
        state: {
          from: location.pathname,
          bookingState: {
            selectedSeats: Array.from(selectedSeats),
            date: form.date,
            slotId: form.slotId,
            name: form.name,
            phone: form.phone,
          },
        },
      });
      return;
    }

    const totalDeposit = selectedSeats.size * DEPOSIT_PER_SEAT;

    // Proceed to payment (Mock)
    toast.success(`Processing payment of ${totalDeposit.toLocaleString("vi-VN")} VND...`);

    // Here we would call the create booking API
    // api.post("/resevations", { ...form, seatIds: Array.from(selectedSeats), totalDeposit })

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="page-container reserve-page-container">
      {/* Header Section */}
      <section className="reserve-hero">
        <div className="container-content">
          <h1 className="reserve-hero-title">Reservation</h1>
          <p className="reserve-hero-subtitle">Secure your exclusive Omakase session. Guests are invited to browse availability before signing in.</p>
        </div>
      </section>

      <div className="reserve-page-content">
        {/* Left Side: Seat Map & Slots */}
        <div className="reserve-map-section">
          <div className="reserve-map-header">
            <h1 className="reserve-title">Tasting Menu Reservation</h1>
            <p className="reserve-subtitle">
              Secure your exclusive Omakase session. Guests are invited to browse availability before signing in.
            </p>

            <div className="form-group" style={{ marginBottom: "24px", maxWidth: "300px" }}>
              <label>1. Select Date</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="slot-picker-wrapper">
              <label className="session-title" style={{ display: "block", marginBottom: "16px" }}>2. Choose Time Slot</label>
              <TimeSlotPicker
                selectedSlotId={form.slotId}
                onSlotSelect={(id) => setForm({ ...form, slotId: id })}
              />
            </div>

            <div className="reserve-legend" style={{ marginTop: "32px" }}>
              <div className="legend-item">
                <span className="legend-color available"></span> Available
              </div>
              <div className="legend-item">
                <span className="legend-color selected"></span> Selected
              </div>
              <div className="legend-item">
                <span className="legend-color occupied"></span> Occupied
              </div>
            </div>
          </div>

          <div className="reserve-map-body" style={{ position: "relative" }}>
            {isLoadingSeats ? (
              <SeatMapSkeleton />
            ) : (
              <ReserveSeatMap
                selectedSeats={selectedSeats}
                occupiedSeats={occupiedSeats}
                onSeatClick={handleSeatClick}
              />
            )}
            {!form.slotId && !isLoadingSeats && (
              <div className="map-overlay-message" style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center",
                justifyContent: "center", borderRadius: "24px", zIndex: 10,
                backdropFilter: "blur(2px)"
              }}>
                <p style={{ fontWeight: 700, color: "var(--secondary-color)", textAlign: "center", padding: "0 20px" }}>
                  Please select a date and time slot to view seat availability.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sidebar Checkout */}
        <aside className="reserve-sidebar">
          <h2 className="sidebar-title">Booking Details</h2>

          <form className="sidebar-form" onSubmit={handleProceedPayment}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 0901234567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="sidebar-summary">
              <h3>Summary</h3>
              <div className="summary-row">
                <span>Date:</span>
                <span className="highlight-text">{form.date || "Not selected"}</span>
              </div>
              <div className="summary-row">
                <span>Slot:</span>
                <span className="highlight-text">{form.slotId || "Not selected"}</span>
              </div>
              <div className="summary-row">
                <span>Selected Seats:</span>
                <span className="highlight-text">
                  {selectedSeats.size > 0 ? Array.from(selectedSeats).join(", ") : "None"}
                </span>
              </div>
              <div className="summary-row">
                <span>Deposit per seat:</span>
                <span>{DEPOSIT_PER_SEAT.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Deposit:</span>
                <span className="total-price">
                  {(selectedSeats.size * DEPOSIT_PER_SEAT).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <p className="summary-note">*(This deposit guarantees your reservation and will be deducted from your final bill)</p>
            </div>

            <button type="submit" className="btn-proceed-payment">
              {user ? "Proceed to Payment" : "Login to Book Now"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
