import axios from "axios";
import config from "../config/index.js";
import { error } from "../utils/response.js";

const PDP_URL = `${config.permit.pdpUrl}`; // local PDP
const PDP_PATH = `/allowed`; // local PDP expects this root-level path

const permitApi = axios.create({
  baseURL: PDP_URL,
  headers: {
    Authorization: `Bearer ${config.permit.apiKey}`,
    "Content-Type": "application/json",
  },
});

export default function authorize(action, resourceIdFn) {
  return async function (req, res, next) {
    try {
      const userId = req.user?.id;
      const resource = resourceIdFn(req); // format: "account:1001"
      const [type, key] = resource.split(":");

      console.log(`🔐 Authorizing: user=${userId}, action=${action}, resource=${resource}`);

      const { data } = await permitApi.post(PDP_PATH, {
        user: { key: userId },
        action,
        resource: { type, key, tenant: "default" },
      });

      if (data.allow === true) {
        return next();
      } else {
        return error(res, 403, "Access denied", "PermissionDeniedError");
      }
    } catch (err) {
      console.error("Permit PDP check failed:", err.response?.data || err.message);
      return error(res, 500, "Authorization failed", "ServiceError");
    }
  };
}
