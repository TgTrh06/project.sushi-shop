import React from "react";

export const SeatMapSkeleton: React.FC = () => {
  return (
    <div className="reserve-svg-wrapper skeleton-loading">
      <div className="skeleton-placeholder" style={{ width: "100%", height: "500px", borderRadius: "16px", background: "rgba(0,0,0,0.05)" }}>
        <div className="skeleton-pulse"></div>
      </div>
    </div>
  );
};
