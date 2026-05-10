import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/admin.service";
import type { SystemStats, AdminReservation } from "@/features/admin/admin.types";
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
    { name: "Pending Payment", value: stats.pendingReservations, color: "#f59e0b" },
    { name: "Completed", value: stats.completedReservations, color: "#10b981" },
  ];
  
  const others = stats.totalReservations - (stats.pendingReservations + stats.completedReservations);
  if (others > 0) {
    pieData.push({ name: "Others", value: others, color: "#6b7280" });
  }

  // Filter out 0 value for pie chart so it looks better
  const filteredPieData = pieData.filter(d => d.value > 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
      {/* Bar Chart */}
      <div className="admin-card">
        <div className="admin-toolbar" style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "var(--admin-text-primary)", fontSize: 16, fontWeight: 600, margin: 0 }}>
            📊 Products by Category
          </h3>
        </div>
        {stats.productsByCategory.length === 0 ? (
          <div className="admin-empty">
            <p className="admin-empty__text">No category data available.</p>
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
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Products" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div className="admin-card">
        <div className="admin-toolbar" style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "var(--admin-text-primary)", fontSize: 16, fontWeight: 600, margin: 0 }}>
            🥧 Reservation Status
          </h3>
        </div>
        {filteredPieData.length === 0 ? (
          <div className="admin-empty">
            <p className="admin-empty__text">No reservation data available.</p>
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
  const [bookings, setBookings] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, bookingsData] = await Promise.all([
          adminService.getStats(),
          adminService.getReservations().catch(() => []), // Graceful fallback
        ]);
        setStats(statsData);
        setBookings(bookingsData.slice(0, 8));
      } catch (err: any) {
        console.error("Failed to load dashboard data:", err);
        setError(err?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusBadge = (status: string) => {
    const statusLabels: Record<string, string> = {
      PENDING_PAYMENT: "Pending Payment",
      PAID: "Paid",
      CANCELLED: "Cancelled",
    };
    
    const map: Record<string, string> = {
      PENDING_PAYMENT: "admin-badge--amber",
      PAID: "admin-badge--green",
      CANCELLED: "admin-badge--gray",
    };
    
    return (
      <span className={`admin-badge ${map[status] ?? "admin-badge--gray"}`}>
        {statusLabels[status] ?? status}
      </span>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">System Overview</h1>
          <p className="admin-page-subtitle">
            Welcome back! Here's a summary of your store's activity.
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
              label="Customers"
              subtitle={`+${stats?.newUsersLast30Days ?? 0} in 30 days`}
            />
            <StatCard
              icon="🍣"
              iconClass="admin-stat-card__icon--red"
              value={stats?.totalProducts ?? 0}
              label="Products"
              subtitle={`${stats?.activeProducts ?? 0} active`}
            />
            <StatCard
              icon="🗂️"
              iconClass="admin-stat-card__icon--green"
              value={stats?.totalCategories ?? 0}
              label="Categories"
            />
            <StatCard
              icon="📅"
              iconClass="admin-stat-card__icon--amber"
              value={stats?.totalReservations ?? 0}
              label="Reservations"
              subtitle={`${stats?.todayReservations ?? 0} today`}
            />
            <StatCard
              icon="⏳"
              iconClass="admin-stat-card__icon--red"
              value={stats?.pendingReservations ?? 0}
              label="Pending Payment"
              subtitle={`${stats?.completedReservations ?? 0} completed`}
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
              Recent Reservations
            </h3>
            <p style={{ color: "var(--admin-text-muted)", fontSize: 13, margin: "4px 0 0" }}>
              {bookings.length} reservations displayed
            </p>
          </div>
          <a href="/admin/reservations" className="admin-btn admin-btn--secondary admin-btn--sm">
            View All →
          </a>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading__spinner" />
            <span>Loading data...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">📅</div>
            <p className="admin-empty__text">No reservations yet.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                    </td>
                    <td style={{ color: "var(--admin-text-secondary)" }}>{b.customerPhone}</td>
                    <td>{b.reservationDate}</td>
                    <td>{b.timeSlot}</td>
                    <td>{b.seatCodes.join(", ")}</td>
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
