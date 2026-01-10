import { useEffect, useState } from "react";
import { fetchPayments } from "../services/api";

export default function Transactions() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments().then(setPayments);
  }, []);

  return (
    <div>
      <h2>Payments</h2>

      <table border="1" data-test-id="payments-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Order ID</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td data-test-id="payment-id">{p.id}</td>
              <td>{p.order_id}</td>
              <td>{p.method}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <a href="/dashboard">Back to Orders</a>
    </div>
  );
}
