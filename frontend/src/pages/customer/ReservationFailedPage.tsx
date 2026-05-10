import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import "../../assets/styles/pages/ReservationResultPage.css";

export default function ReservationFailedPage() {
  const navigate = useNavigate();

  return (
    <div className="reservation-result-page">
      <div className="result-container failed">
        <div className="result-icon failed-icon">
          <XCircle size={80} />
        </div>
        
        <h1 className="result-title">Reservation Failed</h1>
        
        <p className="result-message">
          Unfortunately, your reservation could not be completed. 
          The payment was not successful or was cancelled.
        </p>

        <div className="result-info">
          <p>• No charges have been made to your account</p>
          <p>• Your selected seats have been released</p>
          <p>• You can try booking again</p>
        </div>

        <div className="result-actions">
          <button 
            className="btn-primary" 
            onClick={() => navigate("/reservation")}
          >
            Try Again
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>
        </div>

        <p className="help-text">
          Need help? Contact us at <a href="mailto:support@itsusushi.com">support@itsusushi.com</a>
        </p>
      </div>
    </div>
  );
}
