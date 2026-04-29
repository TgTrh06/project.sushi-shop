import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/admin.service";
import type { SystemStats, AdminBooking } from "@/features/admin/admin.types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

/* ─── Skeleton Loader ──────────────────────────────────── */
const SkeletonCard = () => (
  <div className="admin-stat-card admin-skeleton-card">
    <div className="admin-skeleton admin-skeleton--icon" />
    <div className="admin-stat-card__info">
      <div className="admin-skeleton admin-skeleton--value" />
      <div className="admin-skeleton admin-skeleton--label" />
    </div>
  </div>
);

/* ─── Stat Card ────────────────────────────────────────── */
const StatCard = ({
  icon,
  iconClass,
  value,
  label,
  subtitle,
}: {
  icon: string;
  iconClass: string;
  value: number | string;
  label: string;
  subtitle?: string;
}) => (
  <div className="admin-stat-card" id={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
    <div className={`admin-stat-card__icon ${iconClass}`}>{icon}</div>
    <div className="admin-stat-card__info">
      <div className="admin-stat-card__value">{value}</div>
      <div className="admin-stat-card__label">{label}</div>
      {subtitle && (
        <div className="admin-stat-card__subtitle">{subtitle}</div>
      )}
    </div>
  </div>
);

/* ─── Charts ─────────────────────────────────────────────── */
const DashboardCharts = ({ stats }: { stats: SystemStats }) => {
  const barData = stats.productsByCategory.map((c) => ({
    name: c.categoryName,
    count: c.count,
  }));

  const pieData = [
    { name: "Chờ thanh toán", value: stats.pendingReservations, color: "#f59e0b" },
    { name: "Hoàn thành", value: stats.completedReservations, color: "#10b981" },
  ];
  
  const others = stats.totalReservations - (stats.pendingReservations + stats.completedReservations);
  if (others > 0) {
    pieData.push({ name: "Khác", value: others, color: "#6b7280" });
  }

  // Filter out 0 value for pie chart so it looks better
  const filteredPieData = pieData.filter(d => d.value > 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
      {/* Bar Chart */}
      <div className="admin-card">
        <div className="admin-toolbar" style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "var(--admin-text-primary)", fontSize: 16, fontWeight: 600, margin: 0 }}>
            📊 Sản phẩm theo danh mục
          </h3>
        </div>
        {stats.productsByCategory.length === 0 ? (
          <div className="admin-empty">
            <p className="admin-empty__text">Chưa có dữ liệu danh mục.</p>
          </div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#6b7280", fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#6b7280", fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sản phẩm" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div className="admin-card">
        <div className="admin-toolbar" style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "var(--admin-text-primary)", fontSize: 16, fontWeight: 600, margin: 0 }}>
            🥧 Trạng thái đặt bàn
          </h3>
        </div>
        {filteredPieData.length === 0 ? (
          <div className="admin-empty">
            <p className="admin-empty__text">Chưa có dữ liệu đặt bàn.</p>
          </div>
        ) : (
          <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {filteredPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Page Component ───────────────────────────────────── */
export const DashboardOverviewPage = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, bookingsData] = await Promise.all([
          adminService.getStats(),
          adminService.getBookings().catch(() => []), // Graceful fallback
        ]);
        setStats(statsData);
        setBookings(bookingsData.slice(0, 8));
      } catch (err: any) {
        console.error("Failed to load dashboard data:", err);
        setError(err?.message || "Không thể tải dữ liệu.");
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
      PENDING_PAYMENT: "admin-badge--amber",
      PAID: "admin-badge--blue",
      COMPLETED: "admin-badge--green",
      CANCELLED_REFUNDED: "admin-badge--gray",
      CANCELLED_NO_REFUND: "admin-badge--red",
      NO_SHOW: "admin-badge--red",
    };
    return <span className={`admin-badge ${map[status] ?? "admin-badge--gray"}`}>{status}</span>;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tổng quan hệ thống</h1>
          <p className="admin-page-subtitle">
            Chào mừng trở lại! Đây là tổng hợp hoạt động của cửa hàng.
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="admin-card" style={{ marginBottom: 24, borderColor: "var(--admin-danger)" }}>
          <p style={{ color: "var(--admin-danger)", fontSize: 14 }}>⚠️ {error}</p>
        </div>
      )}

      {/* Stats Grid — Skeleton or Real */}
      <div className="admin-stats-grid">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              icon="👥"
              iconClass="admin-stat-card__icon--blue"
              value={stats?.totalUsers ?? 0}
              label="Khách hàng"
              subtitle={`+${stats?.newUsersLast30Days ?? 0} trong 30 ngày`}
            />
            <StatCard
              icon="🍣"
              iconClass="admin-stat-card__icon--red"
              value={stats?.totalProducts ?? 0}
              label="Sản phẩm"
              subtitle={`${stats?.activeProducts ?? 0} đang bán`}
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
              value={stats?.totalReservations ?? 0}
              label="Đặt bàn"
              subtitle={`${stats?.todayReservations ?? 0} hôm nay`}
            />
            <StatCard
              icon="⏳"
              iconClass="admin-stat-card__icon--red"
              value={stats?.pendingReservations ?? 0}
              label="Chờ thanh toán"
              subtitle={`${stats?.completedReservations ?? 0} hoàn thành`}
            />
          </>
        )}
      </div>

      {/* Charts */}
      {!loading && stats && (
        <div style={{ marginBottom: 28 }}>
          <DashboardCharts stats={stats} />
        </div>
      )}

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

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading__spinner" />
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : bookings.length === 0 ? (
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
