import authorize from "../middleware/authorize.js";

export const canReadAccount = authorize("read", (req) => `account:${req.params.id}`);
export const canEditAccount = authorize("edit", (req) => `account:${req.params.id}`);
export const canViewTransaction = authorize("read", (req) => `transaction:${req.params.reference}`);
export const canCreateTransaction = authorize("create", (req) => `account:${req.body.account_id}`);
export const canViewAnalytics = authorize("read", () => `analytics:global`);
export const canRecommendCreditIncrease = authorize("recommend_credit_increase", (req) => `account:${req.body.account_id}`);
