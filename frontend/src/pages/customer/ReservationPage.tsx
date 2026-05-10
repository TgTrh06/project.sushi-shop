import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ReserveSeatMap } from "@/components/ui/Reserve/ReserveSeatMap";
import { TimeSlotPicker } from "@/components/ui/Reserve/TimeSlotPicker";
import { SeatMapSkeleton } from "@/components/ui/Reserve/SeatMapSkeleton";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useAuthStore } from "@/stores/useAuthStore";
import { type SessionType, calculateDeposit } from "@shared/config/reservation.config";
import api from "@/lib/axios";

export default function ReservePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  // States
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [occupiedSeats, setOccupiedSeats] = useState<Set<string>>(new Set());
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestoringState, setIsRestoringState] = useState(false); // Flag to prevent clearing seats during restoration

  const [form, setForm] = useState({
    customerName: user?.username || "",
    customerPhone: user?.phoneNumber?.toString() || "",
    date: new Date().toISOString().split("T")[0],
    session: null as SessionType | null,
    slotId: null as string | null,
  });

  // Restore booking state after login/register
  useEffect(() => {
    const bookingState = (location.state as any)?.bookingState;
    if (bookingState) {
      console.log("Restoring booking state:", bookingState);
      
      setIsRestoringState(true); // Set flag to prevent clearing seats
      
      setForm({
        customerName: bookingState.customerName || user?.username || "",
        customerPhone: bookingState.customerPhone || user?.phoneNumber?.toString() || "",
        date: bookingState.date,
        session: bookingState.session,
        slotId: bookingState.slotId,
      });
      
      // Restore selected seats
      if (bookingState.selectedSeats && bookingState.selectedSeats.length > 0) {
        setSelectedSeats(new Set(bookingState.selectedSeats));
      }
      
      toast.success("Your booking details have been restored. Please proceed with payment.");
      
      // Clear the state to prevent restoration on refresh
      navigate(location.pathname, { replace: true, state: {} });
      
      // Reset flag after a short delay
      setTimeout(() => setIsRestoringState(false), 100);
    }
  }, [location.state, user, navigate, location.pathname]);

  // Fetch occupied seats with timeout (3 seconds)
  const fetchAvailability = useCallback(async (date: string, session: string, slotId: string) => {
    setIsLoadingSeats(true);
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 3000)
    );

    try {
      const response = await Promise.race([
        api.get(`/reservations/occupied-seats`, {
          params: { date, session, slotId },
        }),
        timeoutPromise
      ]) as any;

      if (response.data.success) {
        setOccupiedSeats(new Set(response.data.data));
        toast.success("Seat availability loaded successfully");
      }
    } catch (error: any) {
      console.error("Failed to fetch availability:", error);
      if (error.message === 'Timeout') {
        toast.error("Loading seats is taking longer than expected. Showing all seats as available.");
        setOccupiedSeats(new Set()); // Show all seats as available
      } else {
        toast.error("Could not load seat availability. All seats shown as available.");
        setOccupiedSeats(new Set());
      }
    } finally {
      setIsLoadingSeats(false);
    }
  }, []);

  useEffect(() => {
    if (form.date && form.session && form.slotId) {
      fetchAvailability(form.date, form.session, form.slotId);
      // Only clear selected seats if NOT restoring from login/register
      if (!isRestoringState) {
        setSelectedSeats(new Set());
      }
    }
  }, [form.date, form.session, form.slotId, fetchAvailability, isRestoringState]);

  // Auto-fill user info when logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customerName: user.username || prev.customerName,
        customerPhone: user.phoneNumber?.toString() || prev.customerPhone,
      }));
    }
  }, [user]);

  const handleSessionSelect = (session: SessionType) => {
    setForm({ ...form, session, slotId: null });
    setSelectedSeats(new Set());
    toast.success(`${session.charAt(0).toUpperCase() + session.slice(1)} session selected`);
  };

  const handleSlotSelect = (slotId: string) => {
    setForm({ ...form, slotId });
    setSelectedSeats(new Set());
    toast.success(`Time slot ${slotId} selected`);
  };

  const handleSeatClick = (seatCode: string) => {
    if (!form.session || !form.slotId || !form.date) {
      toast.error("Please select date, session, and time slot first.");
      return;
    }

    setSelectedSeats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(seatCode)) {
        newSet.delete(seatCode);
      } else {
        newSet.add(seatCode);
      }
      return newSet;
    });
  };

  const handleProceedPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      toast.error("Please login to proceed with payment");
      // Redirect to login page with return state
      navigate("/login", { 
        state: { 
          from: "/reservation",
          bookingState: {
            date: form.date,
            session: form.session,
            slotId: form.slotId,
            selectedSeats: Array.from(selectedSeats),
            customerName: form.customerName,
            customerPhone: form.customerPhone,
          }
        } 
      });
      return;
    }

    // Validation
    if (!form.date || !form.session || !form.slotId) {
      toast.error("Please select date, session, and time slot.");
      return;
    }

    if (selectedSeats.size === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      toast.error("Please provide your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Creating reservation...", { id: "reservation-loading" });

    try {
      const totalDeposit = calculateDeposit(selectedSeats.size);

      const response = await api.post("/reservations", {
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        reservationDate: form.date,
        session: form.session,
        slotId: form.slotId,
        seatCodes: Array.from(selectedSeats),
        totalDeposit,
      });

      if (response.data.success) {
        const { paymentUrl } = response.data.data;
        
        toast.success("Reservation created! Redirecting to payment...", { id: "reservation-loading" });
        
        // Small delay before redirect for better UX
        setTimeout(() => {
          window.location.href = paymentUrl;
        }, 1000);
      }
    } catch (error: any) {
      console.error("Failed to create reservation:", error);
      toast.error(
        error.response?.data?.message || "Failed to create reservation. Please try again.",
        { id: "reservation-loading" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalDeposit = calculateDeposit(selectedSeats.size);

  return (
    <div className="page-container reserve-page-container">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Reservation" }]} />

      <div className="reserve-page-content">
        {/* Left Side: Seat Map & Slots */}
        <div className="reserve-map-section">
          <div className="reserve-map-header">
            <h1 className="reserve-title">Reservation</h1>
            <p className="reserve-subtitle">
              Secure your exclusive Omakase session. Select your preferred date, session, and seats.
            </p>

            {/* Step 1: Select Date */}
            <div className="form-group" style={{ marginBottom: "24px", maxWidth: "280px" }}>
              <label>1. Select Date</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={(e) => {
                  setForm({ ...form, date: e.target.value, session: null, slotId: null });
                  toast.success(`Date selected: ${e.target.value}`);
                }}
              />
            </div>

            {/* Step 2 & 3: Select Session and Time Slot */}
            <div className="slot-picker-wrapper">
              <label className="session-title" style={{ display: "block", marginBottom: "16px" }}>
                2. Choose Session & Time Slot
              </label>
              <TimeSlotPicker
                selectedSession={form.session}
                selectedSlotId={form.slotId}
                onSessionSelect={handleSessionSelect}
                onSlotSelect={handleSlotSelect}
              />
            </div>

            {/* Legend */}
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

          {/* Step 4: Select Seats */}
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
            {(!form.session || !form.slotId) && !isLoadingSeats && (
              <div className="map-overlay-message" style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center",
                justifyContent: "center", borderRadius: "24px", zIndex: 10,
                backdropFilter: "blur(2px)"
              }}>
                <p style={{ fontWeight: 700, color: "var(--secondary-color)", textAlign: "center", padding: "0 20px" }}>
                  Please select a session and time slot to view seat availability.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sidebar Checkout */}
        <aside className="reserve-sidebar">
          <h2 className="sidebar-title">Booking Details</h2>

          <form className="sidebar-form" onSubmit={handleProceedPayment}>
            {/* Step 5: Customer Information */}
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                placeholder={user ? "e.g. John Doe" : "Please login to continue"}
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                disabled={!user}
                required
                style={{
                  cursor: !user ? "not-allowed" : "text",
                  opacity: !user ? 0.6 : 1,
                }}
              />
              {!user && (
                <small style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px", display: "block" }}>
                  Login required to enter customer information
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder={user ? "e.g. 0901234567" : "Please login to continue"}
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                disabled={!user}
                required
                style={{
                  cursor: !user ? "not-allowed" : "text",
                  opacity: !user ? 0.6 : 1,
                }}
              />
              {!user && (
                <small style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px", display: "block" }}>
                  Login required to enter customer information
                </small>
              )}
            </div>

            {/* Summary */}
            <div className="sidebar-summary">
              <h3>Summary</h3>
              <div className="summary-row">
                <span>Date:</span>
                <span className="highlight-text">{form.date || "Not selected"}</span>
              </div>
              <div className="summary-row">
                <span>Session:</span>
                <span className="highlight-text" style={{ textTransform: "capitalize" }}>
                  {form.session || "Not selected"}
                </span>
              </div>
              <div className="summary-row">
                <span>Time Slot:</span>
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
                <span>100,000 ₫</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Deposit:</span>
                <span className="total-price">
                  {totalDeposit.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <p className="summary-note">
                *(This deposit guarantees your reservation and will be deducted from your final bill)
              </p>
            </div>

            {/* Step 6: Proceed to Payment */}
            <button 
              type="submit" 
              className="btn-proceed-payment"
              disabled={isSubmitting || selectedSeats.size === 0}
            >
              {isSubmitting 
                ? "Processing..." 
                : !user 
                  ? "Login to Proceed Payment" 
                  : "Proceed to Payment"
              }
            </button>

            {/* Register link for non-logged in users */}
            {!user && (
              <p style={{ 
                textAlign: "center", 
                marginTop: "16px", 
                fontSize: "14px", 
                color: "var(--text-muted)" 
              }}>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    navigate("/register", { 
                      state: { 
                        from: "/reservation",
                        bookingState: {
                          date: form.date,
                          session: form.session,
                          slotId: form.slotId,
                          selectedSeats: Array.from(selectedSeats),
                          customerName: form.customerName,
                          customerPhone: form.customerPhone,
                        }
                      } 
                    });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary-color)",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Register here
                </button>
              </p>
            )}
          </form>
        </aside>
      </div>
    </div>
  );
}
