import { useState } from "react";

export default function Checkout() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order_id");

  const [method, setMethod] = useState("upi");
  const [vpa, setVpa] = useState("");
  const [card, setCard] = useState({
    number: "",
    exp_month: "",
    exp_year: "",
    cvv: "",
  });
  const [status, setStatus] = useState("");

  const pay = async () => {
    if (!orderId) return alert("Order ID missing");

    setStatus("processing");

    const payload =
      method === "upi"
        ? { order_id: orderId, method, vpa }
        : { order_id: orderId, method, card };

    const res = await fetch("http://localhost:8000/api/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "key_test_abc123",
        "X-Api-Secret": "secret_test_xyz789",
      },
      body: JSON.stringify(payload),
    });

    const payment = await res.json();
    poll(payment.id);
  };

  const poll = (paymentId) => {
    const i = setInterval(async () => {
      const r = await fetch(
        `http://localhost:8000/api/v1/payments/${paymentId}`,
        {
          headers: {
            "X-Api-Key": "key_test_abc123",
            "X-Api-Secret": "secret_test_xyz789",
          },
        }
      );
      const d = await r.json();

      if (d.status === "success") {
        clearInterval(i);
        window.location.href = "/success";
      }

      if (d.status === "failed") {
        clearInterval(i);
        window.location.href = "/failure";
      }
    }, 1000);
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Order ID: {orderId}</p>

      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="upi">UPI</option>
        <option value="card">Card</option>
      </select>

      {method === "upi" && (
        <input
          placeholder="UPI ID"
          value={vpa}
          onChange={(e) => setVpa(e.target.value)}
        />
      )}

      {method === "card" && (
        <>
          <input placeholder="Card Number" onChange={(e)=>setCard({...card,number:e.target.value})}/>
          <input placeholder="MM" onChange={(e)=>setCard({...card,exp_month:e.target.value})}/>
          <input placeholder="YYYY" onChange={(e)=>setCard({...card,exp_year:e.target.value})}/>
          <input placeholder="CVV" onChange={(e)=>setCard({...card,cvv:e.target.value})}/>
        </>
      )}

      <br /><br />
      <button onClick={pay}>Pay</button>
      <p>{status}</p>
    </div>
  );
}
