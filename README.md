# 💳 Payment Gateway with Multi-Method Processing and Hosted Checkout

This repository contains a **complete, end-to-end payment gateway system** with:
- Order creation
- Hosted checkout
- Payment processing using both UPI and Card (test mode)
- Merchant dashboard

The project is built using **Node.js, PostgreSQL, React (Vite), and Docker**, and is fully **Dockerized** so that anyone can run it easily by cloning this repository.

🔗 **GitHub Repository:**  
https://github.com/divyasrisaipravallika/Payment-Gateway-with-Multi-Method-Processing-and-Hosted-Checkout

---

## 🚀 Features

- Merchant authentication using API Key & Secret
- Order creation API
- Payment processing with simulated success (test mode)
- Hosted Checkout Page (React – dynamic, not static)
- Merchant Dashboard (React – dynamic, not static)
- PostgreSQL database for persistence
- Docker & Docker Compose for one-command setup

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  
- **Frontend:** React (Vite)  
- **Containerization:** Docker, Docker Compose  

---

## 📂 Project Structure

```
payment-gateway/
├── backend/            # Backend APIs & DB logic
├── checkout-page/      # React hosted checkout UI
├── frontend/           # React merchant dashboard
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Prerequisites

Make sure the following are installed on your system:

- Docker
- Docker Compose
- Git

---

## ⬇️ Clone the Repository

```bash
git https://github.com/divyasrisaipravallika/Payment-Gateway-with-Multi-Method-Processing-and-Hosted-Checkout
cd Payment-Gateway-with-Multi-Method-Processing-and-Hosted-Checkout
```

---

## ▶️ Run the Project (One Command)

From the **project root directory**:

```bash
docker-compose up -d
```

Verify all containers are running:

```bash
docker ps
```

You should see containers for:
- PostgreSQL
- Backend API
- Checkout UI
- Dashboard UI

---

## 🩺 Backend Health Check

```bash
curl http://localhost:8000/health
```

Expected output:

```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

## 🔐 Merchant Setup (MANDATORY)

### 🔑 Test Merchant (Auto-Created)

⚠️ **Important:**  
A test merchant is **automatically inserted into the database when the backend starts**.  
No manual database setup is required.

#### Test Merchant Credentials:
Merchant Name : Test Merchant
Email : test@example.com

API KEY : key_test_abc123
API SECRET : secret_test_xyz789


---

## 🧾 Create Order (API Test)

```bash
curl -X POST http://localhost:8000/api/v1/orders -H "X-Api-Key: key_test_abc123" -H "X-Api-Secret: secret_test_xyz789" -H "Content-Type: application/json" -d "{\"amount\":500}"
```

Example response:

```json
{
  "id": "order_xxxxx",
  "status": "created"
}
```

👉 Copy the returned **order_id**.

---

## 💳 Checkout Flow (UI Test)

Open browser:

```
http://localhost:3001/?order_id=order_xxxxx
```

### UPI Payment Test

#### Steps
1. Select **UPI**
2. Enter:
   - `test@upi`
3. Click **Pay**

#### Expected Result
- Status → **processing**
- After **1–2 seconds** → **success**

---

### 💳 Card Payment Test (IMPORTANT)

#### Test Card Details
- **Card Number** : 4111 1111 1111 1111  
- **Expiry Month** : 12  
- **Expiry Year**  : 2027  
- **CVV** : 123  

#### Steps
1. Select **Card**
2. Enter the above card details
3. Click **Pay**

#### Expected Behavior
- Status → **processing**
- After a delay → **success** or **failed**
- UI updates automatically via **polling**

> ✔ Card payments resolve slightly slower than UPI (intentional test behavior)


## 📊 Verify Payments (API)

```bash
curl http://localhost:8000/api/v1/payments -H "X-Api-Key: key_test_abc123" -H "X-Api-Secret: secret_test_xyz789"
```

Example output:

```json
[
  {
    "id": "pay_xxxxx",
    "order_id": "order_xxxxx",
    "status": "success",
    "method": "upi"
  }
]
```

---

## 🖥️ Merchant Dashboard

Open browser:

```
http://localhost:3000
```

### Login Credentials (Auto-Created Test Merchant)

The test merchant is automatically created when the backend starts.

API Key    : key_test_abc123
API Secret : secret_test_xyz789

### 🧭 Login Flow

Open the dashboard URL

Enter API Key and API Secret

Click Login

You will be redirected to the Merchant Dashboard

### After Login, You Can View:

All created Orders

All Payments

Payment status (processing / success / failed)

Failure reasons (if any)

Auto refresh every 5 seconds

### Logout

Click the Logout button to clear credentials and return to login page.

### Evaluation Note

✔ Dashboard login uses merchant API credentials
✔ No hardcoded frontend access
✔ Aligned with real-world payment gateway behavior

---

## 🧪 Test Mode Details

- Payments support both success and failure status
- Processing delay is simulated
- No real money involved

---

## ✅ Evaluation Checklist

 * Repository can be cloned and run
 * Docker-based setup works
 * Backend APIs functional
 * PostgreSQL persistence
 * React checkout (dynamic)
 * React dashboard (dynamic)
 * Clear testing steps

---

## 🏁 Conclusion

This project demonstrates a **complete payment gateway workflow** with backend APIs, database persistence, hosted checkout, merchant dashboard, and Dockerized deployment.

It is **fully functional**.
