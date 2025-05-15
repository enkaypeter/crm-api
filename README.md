# FinCRM AI+Auth API

A Fintech CRM-style API demonstrating externalized, fine-grained authorization using [Permit.io](https://permit.io/), with AI-driven decision safeguards.

---

## 🚀 Features
- Role- and resource-based access control
- Externalized policies via Permit.io
- AI agent recommending credit limit increases
- REST API with OpenAPI documentation
- Mock in-memory dataset (no DB needed)

---

## 📦 Tech Stack
- **Backend**: Node.js + Express.js
- **Authorization**: Permit.io PDP (local or cloud)
- **Mock Data**: In-memory users, accounts, transactions
- **Docs**: Swagger UI (`/docs`) via OpenAPI spec
- **Testing**: Supertest, Jest

---

## 🧪 Test Credentials
Use these headers to simulate user sessions:

```
# Admin
x-user-id: 1

# Sales Rep (assigned to accounts 1001, 1002)
x-user-id: 2

# Support
x-user-id: 3

# Customer (owns account 1001)
x-user-id: 4

# AI Agent
x-user-id: 999
```

---

## 📂 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /accounts/:id         | View account info (authorized) |
| GET    | /transactions/:ref    | View transaction (authorized) |
| POST   | /ai/recommend-credit-increase | Trigger AI credit review (authorized) |

> Full OpenAPI docs: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 🛠️ Setup & Run

```bash
# 1. Install dependencies
yarn install

# 2. Create a .env file based on .env.example
cp .env.example .env

# 3. Run local Permit PDP (optional)
docker compose -f docker-compose.pdp.yml up -d

# 4. Sync roles/users/instances to Permit
node scripts/syncPermitData.js

# 5. Start the API server
yarn dev

# 6. Visit docs
open http://localhost:3000/docs
```

---

## 📝 Submission
This project is part of the [Permit.io Authorization Challenge](https://dev.to/devteam/join-us-for-the-permitio-authorization-challenge-3000-in-prizes-and-a-mechanical-keyboard-for-5ah), demonstrating externalized authorization in a real-world fintech scenario with an AI-driven decision flow.

## ⚖️ Completion Badge
![Completion Badge](https://media2.dev.to/dynamic/image/width=192,height=,fit=scale-down,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fbadge%2Fbadge_image%2F374%2FPermit.io_Completion_Badge1.png)
