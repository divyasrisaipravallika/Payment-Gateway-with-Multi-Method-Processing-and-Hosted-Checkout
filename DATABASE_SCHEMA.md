# Database Schema Documentation

---

## merchants

| Column      | Type      | Description |
|------------|-----------|-------------|
| id         | UUID (PK) | Merchant ID |
| name       | TEXT      | Merchant name |
| email      | TEXT      | Merchant email |
| api_key    | TEXT      | API Key |
| api_secret | TEXT      | API Secret |
| is_active  | BOOLEAN   | Active flag |

Test Merchant is auto-seeded at application startup.

---

## orders

| Column      | Type      | Description |
|------------|-----------|-------------|
| id         | TEXT (PK) | Order ID |
| merchant_id| UUID (FK) | Linked merchant |
| amount     | INTEGER   | Amount in paise |
| currency   | TEXT      | INR |
| status     | TEXT      | created |

---

## payments

| Column      | Type      | Description |
|------------|-----------|-------------|
| id         | TEXT (PK) | Payment ID |
| order_id   | TEXT (FK) | Linked order |
| merchant_id| UUID (FK) | Merchant |
| method     | TEXT      | upi / card |
| status     | TEXT      | processing / success / failed |
| error_code | TEXT      | Failure reason |
| created_at | TIMESTAMP | Created time |
| updated_at | TIMESTAMP | Updated time |

---

## Relationships

merchant → orders → payments
