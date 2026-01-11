const BASE_URL = "http://localhost:8000/api/v1";

function headers() {
  return {
    "Content-Type": "application/json",
    "X-Api-Key": localStorage.getItem("apiKey"),
    "X-Api-Secret": localStorage.getItem("apiSecret"),
  };
}

export async function fetchOrders() {
  const res = await fetch(`${BASE_URL}/orders`, { headers: headers() });
  return res.json();
}

export async function fetchPayments() {
  const res = await fetch(`${BASE_URL}/payments`, { headers: headers() });
  return res.json();
}
