import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/admin.service";
import type { DashboardStats, AdminBooking } from "@/features/admin/admin.types";

const StatCard = ({
  icon,
  iconClass,
  value,
  label,
}: {
  icon: string;
  iconClass: string;
  value: number | string;
  label: string;
}) => (
  <div className="admin-stat-card">
    <div className={`admin-stat-card__icon ${iconClass}`}>{icon}</div>
    <div className="admin-stat-card__info">
      <div className="admin-stat-card__value">{value}</div>
      <div className="admin-stat-card__label">{label}</div>
    </div>
  </div>
);

export const DashboardOverviewPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, bookingsData] = await Promise.all([
          adminService.getStats(),
          adminService.getBookings(),
        ]);
        setStats(statsData);
        setBookings(bookingsData.slice(0, 8)); // Show last 8
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "admin-badge--amber",
      confirmed: "admin-badge--green",
      cancelled: "admin-badge--gray",
    };
    return <span className={`admin-badge ${map[status] ?? "admin-badge--gray"}`}>{status}</span>;
  };

  if (loading)
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Tổng quan hệ thống</h2>
          <p className="admin-page-subtitle">
            Chào mừng trở lại! Đây là tổng hợp hoạt động của cửa hàng.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <StatCard
          icon="👥"
          iconClass="admin-stat-card__icon--blue"
          value={stats?.totalUsers ?? 0}
          label="Khách hàng"
        />
        <StatCard
          icon="🍣"
          iconClass="admin-stat-card__icon--red"
          value={stats?.totalProducts ?? 0}
          label="Sản phẩm"
        />
        <StatCard
          icon="🗂️"
          iconClass="admin-stat-card__icon--green"
          value={stats?.totalCategories ?? 0}
          label="Danh mục"
        />
        <StatCard
          icon="📅"
          iconClass="admin-stat-card__icon--amber"
          value={stats?.totalBookings ?? 0}
          label="Đặt bàn"
        />
        <StatCard
          icon="⏳"
          iconClass="admin-stat-card__icon--red"
          value={stats?.pendingBookings ?? 0}
          label="Chờ xác nhận"
        />
      </div>

      {/* Recent Bookings */}
      <div className="admin-card">
        <div className="admin-toolbar">
          <div>
            <h3 style={{ color: "var(--admin-text-primary)", fontSize: 16, fontWeight: 600, margin: 0 }}>
              Đặt bàn gần đây
            </h3>
            <p style={{ color: "var(--admin-text-muted)", fontSize: 13, margin: "4px 0 0" }}>
              {bookings.length} đặt bàn hiển thị
            </p>
          </div>
          <a href="/admin/bookings" className="admin-btn admin-btn--secondary admin-btn--sm">
            Xem tất cả →
          </a>
        </div>

        {bookings.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">📅</div>
            <p className="admin-empty__text">Chưa có đặt bàn nào.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Ngày</th>
                  <th>Giờ</th>
                  <th>Số người</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                      <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{b.email}</div>
                    </td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>{b.guests} người</td>
                    <td>{statusBadge(b.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
