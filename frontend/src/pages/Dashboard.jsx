import { useEffect, useState } from "react";
import { fetchOrders, fetchPayments } from "../services/api";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const apiKey = localStorage.getItem("apiKey");
  const apiSecret = localStorage.getItem("apiSecret");

  if (!apiKey || !apiSecret) {
    // window.location.href = "/";
    return;
  }
}, []);


  const loadData = async () => {
    try {
      setLoading(true);
      const [o, p] = await Promise.all([
        fetchOrders(),
        fetchPayments()
      ]);
      setOrders(o);
      setPayments(p);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // 🔁 auto-refresh every 5 seconds (safe)
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <LogoutButton />

      <h2 data-test-id="dashboard-title">Merchant Dashboard</h2>

      {loading && <p>Loading data...</p>}

      <h3>Orders</h3>
      <ul data-test-id="orders-list">
        {orders.length === 0 && <li>No orders yet</li>}
        {orders.map(o => (
          <li key={o.id}>
            {o.id} — ₹{o.amount} ({o.status})
          </li>
        ))}
      </ul>

      <h3>Payments</h3>
      <ul data-test-id="payments-list">
        {payments.length === 0 && <li>No payments yet</li>}
        {payments.map(p => (
          <li key={p.id}>
            {p.id} — {p.method.toUpperCase()} — <b>{p.status}</b>
            {p.status === "failed" && p.error_code && (
              <span style={{ color: "red" }}>
                {" "}({p.error_code})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
