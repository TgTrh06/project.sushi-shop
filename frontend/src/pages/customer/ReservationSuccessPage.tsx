import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import "../../assets/styles/pages/ReservationResultPage.css";

export default function ReservationSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const txnRef = searchParams.get("ref");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="reservation-result-page">
      <div className="result-container success">
        <div className="result-icon success-icon">
          <CheckCircle size={80} />
        </div>
        
        <h1 className="result-title">Reservation Confirmed!</h1>
        
        <p className="result-message">
          Your reservation has been successfully confirmed and payment received.
        </p>

        {txnRef && (
          <div className="result-details">
            <div className="detail-row">
              <span className="detail-label">Transaction Reference:</span>
              <span className="detail-value">{txnRef}</span>
            </div>
          </div>
        )}

        <div className="result-info">
          <p>✓ A confirmation email has been sent to your registered email address</p>
          <p>✓ Please arrive 10 minutes before your reservation time</p>
          <p>✓ Your deposit will be deducted from your final bill</p>
        </div>

        <div className="result-actions">
          <button 
            className="btn-primary" 
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => navigate("/menu")}
          >
            View Menu
          </button>
        </div>

        <p className="countdown-text">
          Redirecting to home in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
