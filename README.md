# PayPal Payment Integration 

**Payment integration** with complete **createOrder → captureOrder** flow using **React (Vite)** and **Express (ES Modules)**.


## Demo Flow
$12.00 → PayPal → Order: 9HE24829238191009 → CAPTURED 

---

## 📄 Real Backend Logs
    Request received: { amount: '12.00', currency: 'USD' }
    Order created: 9HE24829238191009
    Capture request: 9HE24829238191009
    Payment captured: 9HE24829238191009

---

## 🛠️ Tech Stack
| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 18 + Vite + PayPal JS SDK |
| **Backend** | Node.js + Express (ES Modules) + PayPal Checkout SDK |
| **Security** | dotenv + CORS |
| **Quality** | ESLint + dual .gitignore |
| **Testing** | PayPal Sandbox (USA → India) |

---

## ⚙️ Quick Start

### Backend
cd backend
npm install
cp .env.example .env

Add PayPal Sandbox credentials
npm start

http://localhost:5000/health

### Frontend
cd frontend
npm install
npm run dev

http://localhost:5173/

---

## Test Payments

### Option 1: Test Card (No login)
PayPal → “Pay with Debit or Credit Card”
Card: 371449635398431
Expiry: 12/28
CVV: 1234
Country: United States

### Option 2: Sandbox Buyer (Recommended)
Login: Your USA Personal Sandbox Account
Balance: $5000 fake USD

---

## Cross-Border Transaction Simulation

| Role | Country | Description |
|------|----------|--------------|
| **Buyer (Personal)** | USA 🇺🇸 | Logs in / Uses card |
| **Seller (Business)** | India 🇮🇳 | Backend credentials (.env) |
| **Payment** | USD 💵 | Cross-border sandbox transaction |

---

## Alternative Payment Gateways

This implementation demonstrates **payment integration fundamentals** that translate directly to other payment providers:

**Adaptable to:**
-  **Razorpay** - Indian payments (UPI, Cards, NetBanking) → [SDK Docs](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
-  **Stripe** - Global payments with excellent developer experience → [SDK Docs](https://stripe.com/docs/payments/quickstart)


**Core concepts remain identical:**

// Same 2-step flow across all gateways:

1) Create Order/Payment Intent (backend)
2) Capture/Confirm Payment (after user approval)

The **architecture, security patterns (CORS, .env), and error handling** demonstrated here apply universally across payment SDKs.

---