import express from "express";
import { accounts } from "../mock/data.js";
import { success, error } from "../utils/response.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();


router.get(
  "/:id",
  authorize("read", (req) => `account:${req.params.id}`),
  (req, res) => {
    const account = accounts.find(acc => acc.id === req.params.id);
    if (!account) {
      return error(res, 404, "Account not found", "NotFoundError");
    }
    return success(res, account, 200, "Account retrieved successfully");
  }
);

export default router;
