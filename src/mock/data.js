// src/mock/data.js

export const users = [
  { id: "1", name: "admin", role: "admin" },
  { id: "2", name: "Bob", role: "sales_rep", assigned_accounts: ["1001", "1002"] },
  { id: "3", name: "Carol", role: "support" },
  { id: "4", name: "newuser", role: "customer", account_id: "1001" },
  { id: "5", name: "Eve", role: "customer", account_id: "1002" },
  { id: "6", name: "Frank", role: "customer", account_id: "1003" }

];

export const accounts = [
  { id: "1001", name: "newuser", owner_id: "4" },
  { id: "1002", name: "Eve", owner_id: "5" },
  { id: "1003", name: "Frank", owner_id: "6" }
];

export const transactions = [
  { reference: "TXN100001", account_id: "1001", type: "deposit", amount: 500 },
  { reference: "TXN100002", account_id: "1002", type: "withdrawal", amount: 300 },
  { reference: "TXN100003", account_id: "1003", type: "deposit", amount: 1000 }
];

/*
  Entity Relationship Diagram (ERD):

  [users]
    ├── id (PK)
    ├── name
    ├── role
    └── assigned_accounts (for sales_rep)
                │
                ▼
  [accounts]
    ├── id (PK)
    ├── name
    └── owner_id (FK -> users.id)
                │
                ▼
  [transactions]
    ├── reference (PK)
    ├── account_id (FK -> accounts.id)
    ├── type
    └── amount
*/
