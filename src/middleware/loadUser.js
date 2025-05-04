import { users } from "../mock/data.js";
import { error } from "../utils/response.js";
export default function loadUser(req, res, next) {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return error(res, 401, "Missing x-user-id header", "MissingHeaderError");
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return error(res, 404, "User not found", "UserNotFoundError");
  }

  req.user = user;
  next();
}