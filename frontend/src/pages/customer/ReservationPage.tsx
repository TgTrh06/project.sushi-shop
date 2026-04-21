import { useState } from "react";
import { ReserveSeatMap } from "@/components/ui/Reserve/ReserveSeatMap";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ReservePage() {
  const navigate = useNavigate();
  const DEPOSIT_PER_SEAT = 100000;

  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  // Mock occupied seats reflecting the new layout IDs
  const [occupiedSeats] = useState<Set<string>>(new Set(["C3", "C4", "T1-A", "T1-B", "C8"]));

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });

  const handleSeatClick = (seatId: string) => {
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
    if (selectedSeats.size === 0) {
      toast.error("Please select at least one seat.");
      return;
    }
    if (!form.name || !form.phone || !form.date || !form.time) {
      toast.error("Please fill in your contact details and time.");
      return;
    }

    const totalDeposit = selectedSeats.size * DEPOSIT_PER_SEAT;

    // Trigger Payment logic here
    toast.success(`Redirecting to VNPay for ${totalDeposit.toLocaleString("vi-VN")} VND`);

    setTimeout(() => {
      // simulate redirect for now
      navigate("/");
    }, 2000);
  };

  return (
    <div className="page-container reserve-page-container">
      <div className="reserve-page-content">

        {/* Left Side: Seat Map */}
        <div className="reserve-map-section">
          <div className="reserve-map-header">
            <h1 className="reserve-title">Tasting Menu Reservation</h1>
            <p className="reserve-subtitle">Select your preferred seating below for our exclusive Omakase session or intimate 2-person tables.</p>

            <div className="reserve-legend">
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

          <div className="reserve-map-body">
            <ReserveSeatMap
              selectedSeats={selectedSeats}
              occupiedSeats={occupiedSeats}
              onSeatClick={handleSeatClick}
            />
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
                placeholder="Nguyen Van A"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="0901234567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
            </div>

            <div className="sidebar-summary">
              <h3>Summary</h3>
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
              Proceed to Payment
            </button>
          </form>
        </aside>

      </div>
    </div>
  );
}
